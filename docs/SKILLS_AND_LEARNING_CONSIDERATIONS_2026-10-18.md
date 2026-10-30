# Skills, learning and teaching: considerations, 2026-10-18

Claude, 2026-10-18. A palette, not a spec. Nothing here is selected for a build.

Weibao (2026-10-18), pointing at gap G3 from the 2026-10-17 survey of systems
without a rulebook ("Making says mastery improves control (MR), but no rule says
how mastery is gained, lost, taught or carried to another life"): "work on
/more-to-consider on this and implementation and improvement and more".

Rules applied: MR21–MR23 (mastery improves control, needs new attempts, same
rules for every maker), AD6 and AD8 (means; own stats exact), AD3 (hidden
specialness found in play), AD11 and continuation CA2 (what carries), AD17
(recap by means), AD38 (things work by how they work), BHR13 (injury degrades
control), AR1–AR16 for any seam. The proposed rulebook distilled from this
palette is [SKILL_AND_LEARNING_RULES](SKILL_AND_LEARNING_RULES.md) (SLR1–SLR27).

## What already exists (read, not restated)

| Owner | Covers |
|---|---|
| [Skills and talents](SKILLS_AND_TALENTS.md) | Families, talents, variation axes, ways to gain/lose/change, growth models G1–G40, level meanings L1–L23, scale shapes S1–S14, the life of a level |
| [Skill mechanisms and means](worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md) | Result versus mechanism versus means (M1), substitutions (M2), what a milestone changes (M3), passive progression causes (M4), method traces (M5), competence held by teams and tools (M6) |
| [Skill-growth research](research/skill-growth-2026-10-10/) | Per-world growth profiles (WORLD_GROWTH_AUDIT), level scales, read-history and unread audits |
| [Making rules](MAKING_RULES.md#mastery) | MR21 control not truth, MR22 meaningful new attempts, MR23 same resolver for every maker, MR24 top-grade gates are world law |
| [Continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md) | CA2: learned mastery carries by its nature; expression needs actual body, faculties and means. Names "mastery mapping" as a material gap |
| [Genetics and hero start plan](GENETICS_AND_HERO_START_PLAN_2026-10-17.md) | Where facts live (GHS44), aptitude quantities (GHS94), talents/titles/traits on one trait card (GHS66–GHS83) |
| [Body and health rules](BODY_AND_HEALTH_RULES.md) | BHR13 injury lowers control before removing a verb; body wear and conditioning (BHC3–BHC4) |

**The gap.** The owners above say what skills can be and how a single method is
caused. None says, across worlds and features, what a gain needs, what can take
it away, what a teacher actually passes on, or which part of a skill survives a
new body. The continuation owner's CA2 states the principle; nothing turns it
into data an engine can read. The code has two separate skill stores and no
shared teaching record. Round 1 covers those angles.

## Round 1, 2026-10-18

### SLC-A. Competence has layers on different carriers

The idea most other answers depend on.

| Code | Consideration |
|---|---|
| SLC1 | **Three layers.** *Understanding* (what to do and why; lives in memory), *fluency* (the practiced, automatic doing; lives in the body, nerves, channels or core the practice shaped) and *expression* (whether this body, these tools and this world's mechanisms let you do it now; derived, never stored). A swordsman reborn as a baby keeps understanding, loses fluency and has near-zero expression. Every gain, loss, lesson and crossing below names which layer it touches |
| SLC2 | Layers are an authoring lens, not three mandatory bars. A simple world can collapse them into one level. A world where they come apart (rebirth, possession, transmigration, crippling injury, foreign body) needs them separate, because that is where the story is |
| SLC3 | Some powers sit on a fourth carrier: a *source* (qi core, mana pool, pact, bloodline, system grant). Its custody rules come from the source owner (GHS86), not the skill. A cultivation technique can be understood, fluent and still dead without a core |
| SLC4 | Native YAIR skill XP reads best as fluency for vanilla skills (it grows from doing). Understanding for those skills is implicit and needs no separate field until a crossing or a teacher makes the split matter |

### SLC-B. Gaining

| Code | Consideration |
|---|---|
| SLC5 | **Every gain has a recorded cause:** practice, instruction, text, demonstration, failure, insight, absorption or grant. Simulation power records keep a `cause` (the job or effect that granted them) and a `lineage`; native skills keep none (SLC37, corrected in round 2). The cause decides which layer moved (a book moves understanding; drills move fluency) |
| SLC6 | **Learning needs new information** (MR22 generalized beyond making). Repeating a mastered task teaches little; a harder variant, a new material, a failure with readable feedback or a teacher's correction teaches. Native vanilla skills keep their per-tick XP: that is fluency from volume, a different, legitimate model (G1 use) |
| SLC7 | **Feedback is a means.** Practice without a way to tell good from bad plateaus. A teacher, a measuring tool, a sparring partner or an outcome you can read supplies it. This gives tools and people a learning role without new resources (ties M6, TQ tools) |
| SLC8 | **The challenge band.** Gain is best when the task sits a little above current competence; trivial work teaches little, hopeless work teaches mostly what failure looks like. An adjective per world and skill (how wide the band, how steep the falloff), not a fixed formula |
| SLC9 | **Consolidation.** Some worlds settle gains on rest, sleep or meditation ("you feel ready"). Idle-friendly: away time can consolidate what active play started without inventing new practice (M4 causal condition, AD16) |
| SLC10 | **Grants state their layer.** A skill book grants understanding; a body-shaping elixir grants fluency or capacity; a system skill may grant all three. "You learned Fireball" must say which, or a crossing later has no answer |
| SLC11 | **Aptitude multiplies a named layer.** Quick learner (understanding), natural athlete (fluency), large core (source). One talent card field, no new engine (GHS94, capabilities) |
| SLC12 | **Learning from loss and being hurt** (Kenshi Toughness) is a legitimate cause where the world's mechanism supports it, under AD38. It needs forgiving-recovery framing (AD19) so defeat never becomes the efficient grind by accident unless the player chooses it |

### SLC-C. Holding and losing

| Code | Consideration |
|---|---|
| SLC13 | **Loss names its layer and cause.** "Rust" hits fluency, a curse may seal expression, amnesia hits understanding, a broken core hits the source. A loss without a named layer cannot be fixed or carried correctly |
| SLC14 | **Rust is a per-world dial, default off for ordinary play.** Weibao's comfort direction (forgiving recovery, no hunger death) argues against background decay as a chore. A world can turn it on with an in-world reason (a craft that needs constant practice, an aging body) and by default it then hits fluency only; understanding loss needs its own cause (SLC13) |
| SLC15 | **Savings.** Regaining lost fluency is faster than first learning, because understanding remains. This one rule makes rust, injury recovery, rebirth and possession all feel fair without special cases |
| SLC16 | **Injury and body change lower expression, not mastery** (BHR13). Heal the arm and the skill is back. A permanently changed body may need adjustment practice (M5), not relearning from zero |
| SLC17 | **Removed, sealed or stolen skills are conserved where the mechanism is transfer.** A stolen technique lives somewhere (SR custody thinking): a thief, a crystal, a system bank. A seal leaves it in place and blocks expression |
| SLC18 | **Interference** between conflicting styles (two sword schools, two cultivation methods) is optional world law with a reason, not a global penalty |
| SLC19 | **Aging** shifts layers differently: understanding can keep growing while fluency gain slows and capacity declines, per species lifespan (AD13) |

### SLC-D. Teaching

| Code | Consideration |
|---|---|
| SLC20 | **Teaching passes understanding and feedback, not fluency.** The student still practices, faster and with fewer dead ends. A means that transfers fluency or memory directly (memory stone, inheritance ritual) works by its mechanism (AD38) and says so |
| SLC21 | **Teachers teach only what they hold** (AD6), and teaching is its own competence. A master who cannot explain and a mediocre swordsman who is a great coach are both real |
| SLC22 | **Mentor ceiling** is optional world law: past your teacher's understanding you need a new teacher, a text, insight or invention |
| SLC23 | **Teaching teaches the teacher a little** (G21, not yet established for Frontier). Default small, understanding layer only; a world may make it a whole path (Super Supportive, inferred) |
| SLC24 | **Lessons are transactions:** consent, price, time, access window (the existing `teacher_window` and Eda's paid instruction are this pattern), and for guarded techniques a keeper, oath or lineage. NPC teachers plan by the same means gate as everyone (AD6) |
| SLC25 | **The player teaches too.** Apprentices, heirs and hired hands learn through the same resolver (MR23). Teaching creates a lasting carrier for a method in the world, which matters after the player's life ends (SLC31) |
| SLC26 | **Texts are claims with a source.** A manual, a guild handbook or the player's own notes can be wrong or partial; quality comes from the writer's understanding and writing skill. Testing settles them, like medical knowledge (BHR8) |
| SLC27 | **Institutions supply more than lessons:** calibration, equipment, peers to spar with, a reputation for the certificate. Rank (L3, L5) and competence (L1) stay separate facts |

### SLC-E. Carrying to another life or world

| Code | Consideration |
|---|---|
| SLC28 | **Each layer carries by its carrier** (AD11, CA2). Understanding follows memory along the journey; fluency stays with the body it shaped; a source follows its own custody; tools and notes follow item custody. This is the mastery mapping the continuation owner lists as missing |
| SLC29 | **Relearning in a new body is the cross-life payoff.** Carried understanding makes fluency regrow at a savings rate, per world and body (a dial: how much faster, up to the old level). Rebirth feels powerful without handing out free fluency, and the "practice doesn't carry" line in Skills and talents becomes a curve instead of a reset |
| SLC30 | **Translation across worlds runs by mechanism** (AD38). Swordsmanship works wherever there are swords and a body that can swing; a qi technique in a world with no qi is *dormant*: known, shown, unexpressed until a compatible mechanism or analog appears. By default it is kept; a world that erases carried skills states its reason and warns first |
| SLC31 | **Methods outlive their learner** through students, written records and institutions. A later life, an heir or a stranger can meet the player's old school. This is how teaching pays off across lives without carrying fluency (heir succession already reads lessons taught) |
| SLC32 | **Return to a paused life** merges layers by carrier: the old body still has its fluency; the soul brings newer understanding; the first practice session reconciles them (AD12 reciprocal return) |
| SLC33 | **A learning cheat names its layer.** Fast comprehension, perfect recall, instant muscle memory and boundless core are different cheats with different crossing behavior (AD11 base cheat carries) |

### SLC-F. Knowing your own skill

| Code | Consideration |
|---|---|
| SLC34 | **Own numbers are exact (AD8), and the layer split is shown when it matters:** "You know the form; this body has not learned it yet (fluency 2 of your remembered 7)." Shown only once a split exists, so vanilla play stays clean |
| SLC35 | **Hidden and emergent skills** appear through use or a fitting means (AD3). A dormant carried skill shows as known with "no expression here" and a reason the character can know |
| SLC36 | **Away-time learning is batched** in the recap (AD17): "Woodcutting 31 to 34; the new grip settled after sleep." Never forty toasts |

### SLC-G. Implementation: what the code has today

Read 2026-10-18 from source, not run.

| Code | Finding (shown in source) | Consequence |
|---|---|---|
| SLC37 | **Two skill stores.** Native skills: `Skill` in `src/models/skill.js` (XP curve, parents, milestones, xp multipliers), progress in the levelable component's `skill_progress`. Simulation methods: `state.simulation.powers[actor][id] = {owned, mastery, executions}` fragments and a donor; a per-actor `sources` map holds power sources with expiry (the source layer of SLC3, not a learning-cause record). Mastery rises only through an authored `mastery` effect; `copy` and `transfer` operations already move a power between actors, with `copyMastery` optional and `transfer` clearing the donor (`src/simulation_effects.js:380-401`) | Do not merge them. A read-only layer projection can present both: native XP as fluency, simulation mastery as fluency, actor `sources` as the source layer. Copy versus transfer already models SLC17 and SLC20's direct-transfer case; Each power record also keeps `cause` and `lineage` from its grant (`fresh()` in the same file; corrected in round 2, round 1 said no cause record existed). One authority per fact (AD7, AR) |
| SLC38 | **Teaching records are per feature.** `src/heir_inheritance.js` hard-codes three `LESSON_IDS` and reads `chronicle.life.experience.taught/reflected`; backlog and audit-remainder features keep their own `taught` facts | A shared "who taught whom what, when, from which source" record would let heirs, apprentices and carryover read one fact. Add it only when a second consumer needs it |
| SLC39 | **Skill synergy already has a pattern.** `installTrainingLink` (Cooking 3 gives Alchemy ×1.05) uses native milestone `xp_multipliers` | Reuse milestone multipliers for aptitude and teacher bonuses on native skills; no new engine |
| SLC40 | **MR22 is enforced by authoring in the simulation path** (mastery only moves when a command's effects say so, so a repeated command teaches only if its author made it) and does not apply to native per-tick XP | Keep both models; SLC6 explains why. Novelty applies to simulation methods and makers |
| SLC41 | **Continuation carries no skill data yet** beyond what each feature hand-writes | The relearning curve (SLC29) is the first slice that needs a carried-understanding fact; it belongs in the continuation owner's namespaced slice (AR6), with native XP untouched, so no old-save migration (old save compatibility deferred 2026-10-17) |
| SLC42 | **No inspector shows why a skill is where it is** | A dev view listing each method's layers, sources and a "what would carry" projection, read-only, would make SLC28–SLC30 testable before any UI |

### SLC-H. Improvements to existing owners

| Code | Improvement |
|---|---|
| SLC43 | Skills and talents says "Rebirth with memory: knowledge returns, practice doesn't." Refine to the layer and savings model (SLC28–SLC29). Done as a dated pointer this round |
| SLC44 | Its status line ("Nothing is implemented beyond vanilla YAIR's skills and the existing Rat-step technique") is stale: simulation powers with mastery, skill expansion families, lore practice and the training link exist. Noted with a dated pointer this round |
| SLC45 | Skill mechanisms M4 (passive progression causes) is where consolidation (SLC9) and away-time learning belong; M5 (method traces) is where adjustment after body change belongs. Link, don't copy |
| SLC46 | The Frontier growth profile leaves teacher self-XP (G21) unestablished; SLC23 supplies a default with a dial for when a slice needs it |

### ACT NOW (done this round)

| Code | Action | Done check |
|---|---|---|
| SLA1 | Saved this palette with owners linked, not restated | This file |
| SLA2 | Drafted the proposed rulebook SLR1–SLR27 | [SKILL_AND_LEARNING_RULES](SKILL_AND_LEARNING_RULES.md) |
| SLA3 | Registered it as a proposal in the rules index with a router row | RULES_INDEX register and router |
| SLA4 | Added dated pointers in Skills and talents for SLC43–SLC44 | Its "Getting, losing and changing them" section and status line |
| SLA5 | Recorded Weibao's request in USER_VISION and the idea index | USER_VISION G3 entry; IDEA_INDEX row |

### ACCOUNT FOR NOW (constraints on any slice, no new features)

| Code | Constraint |
|---|---|
| SLN1 | Any new learning fact names its layer (understanding, fluency, source) and its carrier before it gets a save field (pairs with BHN1 scope) |
| SLN2 | No third skill store. New methods extend simulation powers; native skills keep `skill_progress`; a projection reads both |
| SLN3 | Any grant, lesson or item that teaches says which layer it gives (SLC10, SLC20) in its content definition |
| SLN4 | Native per-tick XP is not changed by these rules; old saves stay valid without migration |
| SLN5 | Rust stays off unless a world card turns it on with a reason (SLC14) |

### LATER / DELEGATE

Ranked by playable value. None is authorized by this round.

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| SLL1 | **Relearning curve on continuation** (SLC28–SLC29): a carried method shows "remembered understanding N" in the new life, and its practice gains at a savings multiplier until it reaches N | Strong, M–L | Fresh origin: learn a method to mastery 3 in life A, continue to life B, see mastery 0 with remembered 3, practice reaches 3 faster than A did; save, reload and import keep it; 1920×1080 and 1366×768 evidence |
| SLL2 | **Teacher as feedback** (SLC7, SLC20): an existing paid lesson (Eda or the craftsman window) records a taught fact and raises the next practices' gain, without granting mastery itself | Medium, M | Same practice gains more after the lesson than before; the lesson alone does not change mastery; regression on the effect |
| SLL3 | **Layer inspector** (SLC42): read-only dev view of methods, sources and a carry projection | Medium, S | Shows correct layers for one native skill and one simulation method; mutates nothing |
| SLL4 | **Shared taught record** (SLC38) once a second consumer exists; heir succession reads it instead of `LESSON_IDS` | Medium, S–M | Heir result unchanged on the existing fixture; a new taught method appears without editing the ID list |
| SLL5 | **Dormant carried skill** display (SLC30, SLC35) in the Skills panel | Medium, S | A carried technique with no mechanism in the current world shows known and unexpressed with a reason |
| SLL6 | **World card learning fields:** rust on/off, savings rate, mentor ceiling, teacher self-gain, consolidation (SLC8, SLC9, SLC14, SLC22, SLC23) | Medium, S | Two world cards declare them; one test reads them |

## Round 2: in all directions, 2026-10-18

Weibao: "/more-to-consider in all directions and then begin, commit and push
first with lesser agent tho". Round 1 was committed and pushed first
(`fd2336aff`). This round looks outward from the layer model to every system
it touches. New codes continue from SLC47.

### SLC-I. People, economy and society

| Code | Consideration |
|---|---|
| SLC47 | **Skill is labor.** Wages, commissions and who gets hired follow demonstrated competence, read through means (a trial job, a reference, a guild mark). An employer's belief about your skill can lag or lead the truth (AD6) |
| SLC48 | **Reputation lags competence.** A newly skilled player is still "the newcomer" until someone sees the work; a famous master who lost fluency is still hired on name. Two facts, updated by different causes (SLR19) |
| SLC49 | **Apprenticeship is a contract:** years of labor for lessons, lodging and a tool kit, with an exit cost. A natural idle routine (time paid in, competence out) and a household tie (CHARACTERS owners) |
| SLC50 | **Guilds and monopolies guard methods.** Teaching outside the guild can cost standing; a secret leaking changes prices and who can compete (SR claims, economy AD27) |
| SLC51 | **Methods diffuse.** NPCs who watch the player can imitate a visible method over time, at their own competence. A world remembers who introduced it. Default slow and local; NPC-heavy simulation stays deferred (AD33) |
| SLC52 | **Lost arts.** A world can lose a method when its last holders and records go. Recovering one is exploration and research (SR ruins, libraries), and its understanding may arrive before anyone can perform it |

### SLC-J. Mind, motivation and habit

| Code | Consideration |
|---|---|
| SLC53 | **Bad habits are learned too.** Practicing wrong (a wrong manual, no feedback) can build fluency in an error. Unlearning costs more than learning fresh; a teacher's first job may be undoing it. Optional per skill; pairs with texts as claims (SLR18) |
| SLC54 | **Deviation.** Some worlds punish wrong practice of a dangerous art (qi deviation, a spell misfire). Harm follows the mechanism with BHR10 causes and forewarning (BHR11), not a random tax |
| SLC55 | **Mood, rest and focus affect gain** where the world's body model has them: tired practice teaches less. An adjective that reuses existing vitals (stamina, focus) rather than a new morale meter |
| SLC56 | **Critical periods.** A body may learn some things best young (language, a bloodline art) and others better old. A species and body dial (AD13) that makes child starts and rebirth distinct |
| SLC57 | **Memory capacity is a dial.** Perfect-recall characters keep every understanding; ordinary ones may let unused understanding fade slowly, with notes as external memory (SLC26). Default: understanding does not fade in ordinary play; a world or body that forgets says why |

### SLC-K. Skills meeting other skills

| Code | Consideration |
|---|---|
| SLC58 | **Transfer between related skills** already exists as parent skills and milestone XP multipliers. Treat transfer as understanding carrying into a sibling, fluency starting low. No new engine (SLC39) |
| SLC59 | **Combination and fusion** already exist in the simulation (`definition.constituents`, fusion clears constituents). A fused method's layers come from its parts: understanding of each, fresh fluency in the combined form |
| SLC60 | **Specialization trades breadth.** Choosing a branch can forgo another (the audit-remainder Eda specialization already does: loaded survey versus delicate fitting). A world dial for whether forgone branches reopen later and at what cost |
| SLC61 | **Teaching skill and the taught skill grow separately** (SLR15). A player who teaches often builds a teaching competence that can transfer across subjects |

### SLC-L. Bodies, carriers and odd cases

| Code | Consideration |
|---|---|
| SLC62 | **Grafted or transplanted parts** carry the fluency shaped into them only where the world's mechanism says tissue holds it (the cell-memory trope). By default fluency lives in the whole nervous system, not a limb (AD38 decides per world) |
| SLC63 | **Possession borrows the host's fluency** while understanding stays the possessor's (continuation S4). Leaving takes understanding gained and leaves fluency with the body |
| SLC64 | **Shared bodies and copies.** Clones and split selves start with the original's understanding and fluency at the split, then diverge. A reunion merges by carrier like a return (SLC32) |
| SLC65 | **Constructs and avatars** can hold fluency in their mechanism (a trained golem). Training a construct is teaching under MR23 |
| SLC66 | **Companions and animals learn tricks** through the same layers at their own species rates (companions audit) |

### SLC-M. Idle, time and prestige

| Code | Consideration |
|---|---|
| SLC67 | **Practice as a routine.** Practice commands are already `automatable` and stop at the drill limit or missing means. That is the idle model: set once, stop with a reason, batch the recap |
| SLC68 | **Drill limits are prototype caps, not world law.** "Complete at mastery four" should read as "this drill teaches up to four; a harder drill, teacher or insight goes further" (MR24, AD5), so the cap names its next route |
| SLC69 | **Prestige uses the layer model.** The first milestone's single prestige layer is not built yet (PROJECT). When it is, its reset should say per layer what survives: understanding by default, fluency per the prestige's fiction, sources per custody. Then prestige, rebirth and continuation share one rule (SLR20) |
| SLC70 | **Away-time learning respects stops.** Consolidation (SLC9) can run while away; anything that needs a choice (a branch, a lesson offer) waits (AD16) |

### SLC-N. Knowledge, display and testing

| Code | Consideration |
|---|---|
| SLC71 | **Forecasts of learning reflect knowledge (AD9):** "about two more coached sessions to mastery 3" once the character has seen the rate; "unknown" before |
| SLC72 | **In no-status worlds** the character's own sense of skill is fiction, while the player's numbers stay exact (AD8). Text can say "you feel steadier" beside the exact number; the two do not conflict |
| SLC73 | **Insight and epiphany draws are seeded** by the save's RNG context so reload does not reroll them (AD22, Rulebook 9) |
| SLC74 | **Learning is testable through scenarios:** a fixture that runs lesson, practice and coached practice in a fresh state and asserts the mastery path is the cheapest guard for every learning rule |
| SLC75 | **Generated teachers, manuals and schools** take world, era and institution as inputs and output layer-tagged lessons (GR contract, SLN3) |

### SLC-O. Ethics and danger

| Code | Consideration |
|---|---|
| SLC76 | **Forbidden arts and oaths.** Teaching a banned method or breaking a lineage oath has in-world consequences from in-world agents with reasons, not a game-level block (AD38, design framing) |
| SLC77 | **Students can turn.** A taught method in a rival's hands is a story, not a bug; record who taught whom (SLC38) so the world can trace it |

### Code check for this round

Read 2026-10-18, not run. Lessons (`skills.<kind>.learn`) teach the method and
grant its source; practice (`skills.<kind>.practice`) refines mastery by 1 and
adds 8 native XP, automatable, capped at mastery 4. So round 1's SLL2 ("a lesson
raises later practice gain") mostly restates what the gate already does. The
gap is feedback during practice: no command lets a teacher's attention make
practice teach more. That is the slice this round begins (SLL7).

### ACT NOW (done this round)

| Code | Action | Done check |
|---|---|---|
| SLA6 | Committed and pushed round 1 through a lesser agent | `fd2336aff` on origin |
| SLA7 | Saved round 2 (SLC47–SLC77) and added SLR28–SLR33 | This section; rulebook |
| SLA8 | Replaced SLL2 with SLL7 after the code check and withdrew its session card | SLL table below |
| SLA9 | Began SLL7, coached practice | Status in the SLL7 row |

### ACCOUNT FOR NOW, added

| Code | Constraint |
|---|---|
| SLN6 | A drill cap names its next route in its reason text (SLC68) |
| SLN7 | Any future prestige reset declares survival per layer (SLC69) |
| SLN8 | Insight or epiphany rolls use the save's seeded RNG (SLC73) |
| SLN9 | Teaching attention spends the teacher's existing `focus` resource, not a new one |

### LATER / DELEGATE, revised

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| SLL2 | Superseded by SLL7 (lessons already gate practice) | n/a | n/a |
| SLL7 | **Coached practice** (SLC7, SLR6): practicing timber judgment with the craftsman's attention and a fee refines mastery by 2 instead of 1, same drill cap, same stops | Medium, S–M | **Done 2026-10-18, implemented and browser-verified; not yet human-accepted.** See the SLL7 evidence below |
| SLL8 | Drill cap reasons name the next route (SLN6) | Light, S | All four practice caps name a route; text-only regression  **Done 2026-10-19 with SLL12:** the caps are gone, and each drill text names what teaches more. See SLL12 evidence |
| SLL9 | Apprenticeship contract as an idle routine (SLC49) | Strong, L | Separate scope; needs household owner |
| SLL10 | Learning scenario fixture covering lesson, practice, coached practice (SLC74) | Medium, S | One test file runs all three from fresh state |

### SLL7 evidence, 2026-10-18

Change: `skills.timber.coached_practice` in `src/skill_expansion_content.js`
(a `coached` builder beside `practice`; `refine` takes an amount). Costs 2
stamina, 1 coin, 1 Rough wood log and 1 unit of the craftsman's `focus`
(SLN9); needs his teaching hours and presence; refines mastery by 2, adds 8
Woodworking XP; allowed up to mastery 2, so the drill still ends at 4;
cancellation refunds. No save schema change: it writes the existing power
record.

| Check | Result |
|---|---|
| `node --test tests/skill_coached_practice.test.js` (new) | 3/3 pass: coached 0 to 2 versus plain 0 to 1 through the real see/learn route; blocked at the limit and with no attention, plain still allowed; cancel refunds and teaches nothing; save round trip keeps mastery 2 |
| `npm test` | 2125 pass, 0 fail, 3 todo |
| `npm run check:arch` | exit 0 (reported growth in `display.js` and `save_files.js` is from other sessions' edits) |
| `npm run check:rules` | 29 failures, all from AD38 sitting out of numeric order in RULES_INDEX since `7aff73553`; none from this change |
| `npm run build`, fresh origin `127.0.0.1:19531`, 1366×768 | Generated save given the craftsman meeting, 30 coins and 10 logs; enrolled, saw the grain and took the lesson through the panel buttons; one real click on coached practice took mastery 0 to 2, money 29 to 28 and his attention 2 to 1, and reached the matched-cuts milestone |
| Reload | Mastery 2 and all timber actions kept after reload and PLAY |
| Import | Exported the mastery-2 save as a `YAIR-UTF8-1` string; a second coached session took mastery to 4 and disabled the button at the limit; `load_progress` import restored mastery 2, money 28 and an enabled coached button |
| 1920×1080 | After import and PLAY: coached practice visible and enabled; the known-method summary lists "Ready: Practice Timber judgment with his corrections"; no console errors |

Gaps: the disabled button shows the panel's generic "Current preparation,
access or agreed attention does not support this action." rather than the
drill-limit reason; that is how every action in this panel projects reasons
(SLL8 covers naming the next route). The pinned "Notes, practice & people"
title overlaps the first card heading at 1366×768; this predates the change.
Reaching the panel takes More panels, then Notes, practice & people, then
Practice; that discoverability question belongs to the UI owners, not this
slice.

## Round 3: stolen memory, simple repetition and more, 2026-10-18

Weibao, after seeing the rulebook and coached practice: "what about stolen
memory and more? more to consider? What abut simple repitition?" New codes
continue from SLC78. Franchise rows marked MEMORY are recall awaiting a source
check; public franchise facts are not sealed.

### Correction first: round 1 undervalued simple repetition

| Code | Finding |
|---|---|
| SLX1 | **SLR5 overreached.** Round 1 generalized MR22 into "repeating a mastered identical task teaches little". MR22 is about knowledge: repeating an identical *observation* reveals nothing new. MR21, also standing, counts lower time cost, narrower variance and better yield as skill, and those are exactly what repetition builds. AD38 (things work by how they work) settles it: repetition works, because practice really does make people faster and steadier. Fixed in SLR5 below |
| SLX2 | **The prototype drill hard-stops at mastery 4**, so simple repetition currently ends at 4 for all four methods. That reads as a world law nobody chose (SLR29 already flagged naming the next route; round 3 goes further, SLC81) |

### SLC-P. Simple repetition

| Code | Consideration |
|---|---|
| SLC78 | **Repetition is the main engine of fluency.** Each repeat makes the same work faster, cheaper in stamina, steadier in outcome and less attention-hungry. Understanding grows little from it after the first few runs; fluency keeps growing. This is the layer model's answer: repetition and new information feed different layers, and both are real learning |
| SLC79 | **What repetition buys, concretely** (MR21 control list): time cost falls, stamina cost falls, variance narrows (fewer spoiled cuts), the method becomes automatable or runs alongside something else, and fatigue sets in later. Each is a number the engine already has; none needs a new resource |
| SLC80 | **Diminishing, not zero, by default.** Gains follow a smooth falling curve (the power law of practice: each doubling of repetitions buys about the same improvement). The thousandth swing still helps a little. Dial per world and skill: steepness, and an optional plateau that only variation, feedback or insight lifts |
| SLC81 | **Drill limits become plateaus, not walls.** Past a drill's design point, plain repetition keeps paying at a smaller rate instead of being refused; a coach, a harder variant or a new material lifts the plateau. The old "complete at four" stays true of *that drill's fast gains* |
| SLC82 | **Real work counts as repetition.** Cutting actual kits, brewing actual potions and fighting actual rats repeat the method too. Learning by doing is slower per minute than a focused drill and pays in goods; a drill is faster learning and pays nothing. That gives the player a real choice between drilling and working |
| SLC83 | **The counter already exists.** Simulation power records increment `executions` on every powered command (`src/simulation.js:223`). A fluency curve can read it with no new save data; native skills already turn repetition into XP per tick |
| SLC84 | **Repetition is the idle loop.** Set a routine, leave, come back faster at it. Weibao is the player and likes idle play; repetition that quietly stops paying would remove the genre's main pleasure. Batched recap: "Timber cuts: 40 more done, now 3 min each instead of 4" (SLC36) |
| SLC85 | **Repetition without feedback can groove errors** where a skill opts in (SLR28). Default for ordinary crafts: off, since real work usually shows its own result. On for subtle arts (qi circulation, a misremembered form) where wrong practice looks fine until it fails |
| SLC86 | **Mental rehearsal** is a weaker form of repetition with no body cost: visualization builds some fluency, much less than doing it. Useful where the body cannot practice (injured, imprisoned, a baby after rebirth) and as an in-world reason for "practicing in your head" during travel |
| SLC87 | **Boredom and attention** are an optional dial, default off. A world or character may learn less from mindless repetition; the default idle game does not punish it |

### SLC-Q. Stolen, copied and altered memory

Memory is the carrier of understanding (SLR1, SLR20), so anything that touches
memory touches skills.

| Code | Consideration |
|---|---|
| SLC88 | **Taking memory takes understanding, not fluency.** A victim whose memories of swordsmanship are stolen keeps the trained hands: the body still moves right in a fight while the mind cannot explain or teach it (the amnesiac-agent trope). Relearning is fast because fluency remains (SLR11 in reverse) |
| SLC89 | **The thief gets understanding without fluency.** Stolen knowledge of a technique lets the thief know what to do, then practice it at the savings rate, much like a reborn character. Stealing memory is a shortcut to understanding, never to instant mastery, unless the means also takes the body's training (SLR8 says the means must state it) |
| SLC90 | **Take, copy or seal are different mechanisms.** Take moves the memory (the victim loses it); copy duplicates it (both keep it); seal blocks access (it stays, unreadable). The simulation's `transfer` and `copy` power operations already model the first two for powers. Memory theft reuses that shape with a memory carrier, conserved when taken (SLR13) |
| SLC91 | **Memories carry more than skills.** A stolen memory can hold names, relationships, secrets, routes and identity. Taking someone's memory of a person can erase that person from their life (MEMORY: Re:Zero's Gluttony eats names and memories, and others forget the victim). Which parts go is the means' stated scope, not "everything" |
| SLC92 | **Reading memories is appraisal of the mind** (AD6, MEANS_AND_APPRAISAL). It shows only what its means reach, and reading a sealed world truth goes through the sealed-secrets gate: the reader learns it in play, and agents still do not reveal it to Weibao outside its discovery route |
| SLC93 | **False and implanted memories** give wrong understanding with full confidence: a forged technique that grooves a bad habit (SLC85), a fake past that bends loyalties. Testing exposes them like any wrong manual (SLR18) |
| SLC94 | **Memory stored outside the person** (a crystal, a pensieve-style bowl, a book of one's own life, a spirit that holds it) becomes an item with custody: it can be lost, sold, stolen, inherited or read by someone else. Notes are the ordinary version (SLC26) |
| SLC95 | **Recovering stolen memory** follows the mechanism: kill or defeat the eater, break the seal, find the crystal, or relearn from your own notes and students. Each route is an in-world path, not a menu reset |
| SLC96 | **Where memory lives decides crossings.** If memory lives in the soul, brain injury does not erase it and rebirth carries it (AD11 default); if it lives in the brain, a body swap leaves it behind. Per world and per means, stated on the world card (MEMORY: Mother of Learning anchors memory to the soul across loops) |
| SLC97 | **The player's own memory is protected by default.** Losing the player's memories is a severe, forewarned consequence (AD19, BHR11 pattern), never ambient, and the player keeps a known record of what was lost so recovery is possible. A world or cheat may make it a real stake with a stated reason and warning |
| SLC98 | **NPCs follow the same rules** (MR23, SLR17): an NPC can steal the player's technique, an apprentice can be robbed of what they were taught, and a world records who holds what (SLC38) |

### SLC-R. Other ways skills move between people and times

| Code | Consideration |
|---|---|
| SLC99 | **Time loops are the cleanest layer test.** Memory carries, the body resets: understanding accumulates across loops, fluency restarts every loop, so a looper becomes a brilliant theorist who must rebuild the body each time unless the body comes too (MEMORY: Mother of Learning) |
| SLC100 | **Time-dilated training** (a room where a day outside is a year inside) gives real repetition time. It costs what the world says (aging inside, access, price) rather than being free speed |
| SLC101 | **Shared and linked minds** (hive minds, a familiar's bond, twins) can share understanding live without moving it; breaking the link ends the sharing and leaves what each mind learned on its own |
| SLC102 | **Absorption** (eating, devouring, absorbing a core) takes what the mechanism says: a monster core may give a source, eating a brain may give fragments of memory, and neither gives fluency by default |
| SLC103 | **Skill crystals and system grants** state which layer they write (SLR8); a crystal that writes fluency is a strong item and can be priced as one |
| SLC104 | **Dream and sleep learning** fits consolidation (SLC9): sleep settles the day's repetitions; a world may add dream training as rehearsal with no body cost (SLC86) |

### Implementation notes for this round

Read 2026-10-18, not run.

- `executions` on each power record is the repetition count (SLC83). A pure
  function `fluencyFromExecutions(executions, curve)` returning time and
  stamina multipliers would let a method's work commands get cheaper with use.
  The command's `duration` and stamina cost are resolved in `previewCommand`
  through `resolveEffectAmount`, and `previewPowerModel` already has a
  practice-model `costScale` and `masteryBands` hook; a fluency band read from
  executions fits there without a new store.
- The practice drill's `lte 3` gate (SLX2) would become a plateau: past it, a
  plain drill still runs but grants a smaller share. MR22's "identical
  observation" stays enforced for knowledge effects (seen/understood records
  are written once).
- Memory theft would reuse the `copy`/`transfer` power operations with a memory
  carrier; nothing in the current runtime models memory as a carrier yet, so it
  stays LATER.

### ACT NOW (done this round)

| Code | Action | Done check |
|---|---|---|
| SLA10 | Corrected SLR5 so repetition builds fluency (SLX1) | SLR5 text |
| SLA11 | Added SLR34–SLR39 for repetition and memory | Rulebook round 3 section |
| SLA12 | Saved round 3 (SLC78–SLC104) | This section |

### ACCOUNT FOR NOW, added

| Code | Constraint |
|---|---|
| SLN10 | No new feature makes repetition stop paying entirely without a stated plateau and a named route past it (SLC80–SLC81) |
| SLN11 | Any memory-affecting means states take, copy or seal, and which parts of memory it reaches (SLC90–SLC91) |
| SLN12 | Repetition counts read `executions`; no second repetition counter (SLC83) |

### LATER / DELEGATE, added

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| SLL11 | **Fluency from repetition** (SLC78–SLC83): timber kit cutting gets faster with `executions`, on a falling curve | Medium, M | **Done 2026-10-18, implemented and browser-verified; not yet human-accepted.** See SLL11 evidence below |
| SLL12 | **Plateau instead of drill wall** (SLC81, SLX2): plain practice past mastery 4 still grants a reduced gain; coached lifts it | Medium, S–M | Regression on the curve; existing drill tests updated; panel names the route past the plateau  **Done 2026-10-19, implemented and browser-verified; not human-accepted.** See SLL12 evidence below |
| SLL13 | **Memory carrier and memory theft** (SLC88–SLC97) as a scoped design pass before any runtime work | Strong, M (design) | One world card states where memory lives; one worked case shows take, copy and seal outcomes per layer |

### SLL11 evidence, 2026-10-18

Change: a pure `fluencyDuration(base, fluency, executions)` in
`src/power_models.js`; `commandDuration` in `src/simulation.js` applies it in
both preview paths, and the accepted job now takes `preview.duration` (computed
before this run's `executions++`); `src/simulation_contracts.js` validates an
optional `fluency: {floor, halfAt}` (needs `powerId`, floor 1 to base, halfAt
above 0, no extra keys); the skills panel shows the practiced minutes with
"(practiced from N)"; both timber cutting commands use `{floor: 1, halfAt: 20}`.
Labels lost their fixed "3 min"; the details line carries the live time. No save
field was added: the curve reads the existing `executions` and jobs still store
a numeric `due`.

Curve: 3 min for uses 0 to 6, 2 min from use 7, 1 min from use 61, never below
1. Drills, coached drills and real cuts all count, because they are all uses of
the method.

| Check | Result |
|---|---|
| `node --test tests/skill_fluency.test.js` (new) | 3/3 pass: curve monotonic with floor and base; four drills plus three cuts make 7 uses, preview and the accepted job both take 2 min and the cut still makes a real kit; save round trip keeps 2 min; 61 uses reach 1 min; the contract rejects four malformed curves |
| `tests/skill_coached_practice.test.js` | 3/3 still pass |
| `npm test` | Run 1: 2130 pass, 1 fail (not captured, did not recur); runs 2 and 3: 2131 pass, 0 fail |
| `npm run check:arch` | exit 0 |
| `npm run check:rules` | Same 29 pre-existing AD38 ordering failures, none from this change |
| Build, fresh origin `127.0.0.1:19532`, 1366×768, bundle `v0.6-ab82ffe0cc04` matching `index.html` | Generated save with the craftsman meeting, 60 coins, 40 logs; enrolled, saw, learned and cut ten real kits through the panel. The shown time switched from 3 to "2 played minutes (practiced from 3)" exactly at 7 uses; reading the save in the click's own tick, a cut at 9 uses was due in 2 minutes (clock 72, due 74) |
| Reload | 10 uses and the 2-minute time kept after reload and PLAY |
| Import | Exported at 10 uses, cut twice more (12), imported the export: back to 10 uses, 2 minutes, button enabled |
| 1920×1080 | After import and PLAY, both cutting actions show "2 played minutes (practiced from 3)"; no console errors |

Gaps: the card shows mastery (drill progress) but not the number of uses that
drives fluency, so the player sees the time drop without seeing the count
behind it; a "uses 10" line would make the curve legible (follow-up, not
built). Mastery and fluency now move separately on purpose: ten real cuts left
mastery at 0 and made cutting faster, which is the layer model working, and it
may still surprise a first-time player.

### Domain rule application to SLL7 and SLL11, 2026-10-19

Weibao accepted the domain rulebooks on 2026-10-19 "as long as core rules are
followed"; SLR codes in [DOMAIN_RULES](DOMAIN_RULES.md#skill-and-learning-rules)
bind these two built slices as default dials. Checked against source as built.

- **SLL7 coached practice meets** SLR6 (the craftsman's attention is a feedback
  means that raises what practice yields), SLR14 (the lesson does not hand over
  mastery; the student still practices), SLR15 (he teaches only with presence,
  teaching hours and his own `focus`, SLN9) and SLR16 (fee, time, attention and
  access make it a transaction).
- **SLL11 fluency meets** SLR5/SLR34 (repetition keeps paying on a smooth falling
  curve with a floor), SLR35 (real cuts count as uses) and SLN12 (reads
  `executions`, no second counter).
- **Departs: SLR29** (a drill cap names its next route). The mastery-4 cap shows
  the panel's generic refusal. **SLR34/SLN10** (repetition does not stop by
  default; a plateau names what lifts it): plain practice stops dead at mastery 4,
  a hard wall. **SLR24** (own numbers exact; the layer split appears once it
  exists): fluency now exists as a layer, but the use count behind it is not
  shown. SLL8 and SLL12 below close the first two; the third is the "uses 10"
  follow-up in the SLL11 gaps.

### SLL12 evidence (with SLL8 and the uses line), 2026-10-19

Selected under the 2026-10-19 rulebook acceptance (task A4) because it closes
the three departures recorded above: SLR34/SLN10 (hard drill wall), SLR29 (cap
without a named route) and SLR24 (fluency shown without its use count). Rules:
SLR5, SLR6, SLR14, SLR24, SLR29, SLR34, MR21, AR1–AR16, UR (text only), AD36.

**Change** (proposal dials). `src/skill_expansion_content.js`: plain practice
has no mastery requirement; its refine amount is the existing effect formula on
`power.<id>.mastery`: 1 per session up to mastery 4, then 1.75 − 0.25 × mastery,
floor 0.125 (0.75 at 4, 0.5 at 5, an eighth from 6.5). Coached practice is
exactly double (max 2, floor 0.25) with no cap, so the craftsman's corrections
lift the plateau. Texts name the route: timber names his corrections; brace,
trail and inquiry say a watching teacher would teach more (no coached drill
exists for them yet). Automation now stops on missing means only.
`src/skill_expansion_host.js` and `src/skill_expansion_ui.js`: the method card
reads "mastery N · U uses" (mastery to two decimals; uses from `executions`,
SLN12). No save field: mastery was already a finite number; old saves load as
they are.

| Check | Result |
|---|---|
| `tests/skill_plateau.test.js` (new) | 1/1: real see/learn route, 30 plain sessions; gains 1,1,1,1,0.75, never rising, never below 0.125, last at the floor; 30 uses; no wall; text names the floor and the coached route and drops "drill limit" |
| `tests/skill_coached_practice.test.js` (updated) | 3/3: the limit test now checks past-four plain 4 → 4.75 versus coached 4 → 5.5; attention and cancel checks unchanged |
| `tests/skill_fluency.test.js` | 3/3 unchanged |
| `npm run build && npm test` | build OK; 2247/2247 |
| `node --test tests/headless/*.test.js` | 7/7 |
| `npm run check:arch` | growth 0 on all three files; 6 main imports; 226 cyclic edges |
| `npm run check:rules` | PASS |
| Browser, new origin 127.0.0.1:19551, 1920×1080, bundle `v0.6-7041577bbff2` | Generated save with elder and craftsman met, 60 coins, 20 logs. Through the panel: enroll, see the grain, lesson, plain practice 0 → 1 → 2 → 3 → 4 → 4.75 (past the old wall), coached 4.75 → 5.875 for 1 coin and 1 attention (double the 0.5625 plain gain). Opened from More panels → Notes, practice & people: the card reads "Learned · mastery 5.88 · 6 uses" with the plateau text. Reload kept 5.875 and 6 uses; Export taken; one more plain session 5.875 → 6.15625; literal Import restored 5.875 and 6 uses; no console errors. Buttons were pressed by DOM click on the exact elements |

**Gaps.** The disabled-button reason is still the panel's generic sentence
(seen once during a passing village event); the per-requirement reason is a
panel projection change for the UI owners. Gains are proposal dials for
Weibao's play acceptance. A plateau with no coached drill (brace, trail,
inquiry) names a teacher who does not exist yet in that method; that is the
honest current route, and SLL9/SLL10 are where such teachers would come from.

## Round 4: carrier and clock fit, 2026-10-18

**SLC105.** Body fluency is a useful default, not a law that memory/soul/construct means cannot bypass. Name the faculty actually changed by practice and the clock that advances it; copied memory grants whatever its actual mechanism transfers (AD11/AD38, SLR1/SLR20/SLR37). A lesson cannot borrow participation from a frozen teacher. Interrupted learning settles paid/performed segments and preserves acquired knowledge (G27/G28).

ACT NOW: reconcile the rule owner and repeatable audit routing where one exists.
ACCOUNT FOR NOW: apply this to a selected consumer; it adds no independent store,
clock or generic resolver. LATER: one synthetic composed case at that seam,
strong cross-domain agent, medium effort when selected; done by relevant source
checks and a useful rebuilt desktop journey with current-state persistence.
No runtime change or new implementation priority in this round.


## Recovered Corc round 6, 2026-10-21: practice changes more than a multiplier

**Proposals**, linked to [title benefit modes](SKILLS_AND_TALENTS.md#recovered-corc-round-6-2026-10-21-title-benefits-by-mechanism) and [CRL43/CRL46](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-6-2026-10-21-title-benefits-and-small-opportunities); existing SLR, M4 and SLC owners remain authoritative.

The recovered running action trains a skill while spending bodily resources and wearing footwear. Its title changes running's energy cost, not every consequence of practice. For OOPS, a selected practice route can express progress as changed economy, observation or method, while its actual tool/body/environment consequences remain legible. Resting or changing method may be a useful next move without turning each practice session into manual maintenance.

A new faculty may enable examination or a new method; aptitude improves learning without inventing present mastery. If an optional worn title improves XP, use the existing title projection and the action's actual XP settlement policy. A resting title is not proof of arbitrary offline learning, and a title described as activated does not imply every skill needs a button.

**ACT NOW (done):** saved this integration. **ACCOUNT FOR NOW:** inspect the selected route's producer, ongoing cost, XP settlement and stop/recovery together. **LATER / DELEGATE:** pair one real training activity with its title boundary; Sol medium, small/medium. Done: before/after rate and outcome are explained, stopping removes actual activity cost without erasing the earned passive, and already-settled XP is unchanged. No new universal wear or hunger rule is selected.


## Recovered Corc round 8, 2026-10-21: books after learning and changing reading pace

Weibao now requests implementation of all useful recovered-26 additions, continuing fitting slices through the existing coverage table. [CRL49–CRL50 and evidence](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-8-2026-10-21-useful-mechanics-beyond-titles) add these cases to the implementation palette. This authorization permits reasonable native choices; examples are not commands to reproduce source-world constants. Existing SLR/MR21–MR23, AD15–AD17/AD31/AD38 and UR61/UR63 remain authoritative.

**CRL49, a book has a useful life after its new facts are learned.** The historical source converts an already-read book into a home furnishing with a locality-sensitive Literacy-learning modifier and remove/return hooks. Separate retained understanding, the physical copy, a place's study support and practice. A shelf may improve a real reading session through reference access or comfortable study without teaching the same fact again merely on hover or possession. Removing the copy changes the environmental support, not the memory already learned. Repeated copies contribute as the selected world's real mechanism warrants; no universal per-copy percentage is imported.

For OOPS, inspect existing completed-book/furnishing/rereading readers before adding anything. A useful implementation uses a real owned copy or supported existing furnishing as one concrete study aid, reads it through the existing reading/XP owner, and gives it a readable local consequence. A purely decorative book may remain decorative. A soft book-spine accent, brief settled-book line or quiet remembered title can express the consequence without another reward.

**CRL50, an estimate can change while completed work remains.** The source retains per-book reading progress on Stop and recomputes completion needs from current Literacy/rate during the session. Its moving-dot timer is separate from reading completion. OOPS already has book progress and native reading rate inputs; reuse them. Keep accumulated work, actual rate and estimated time distinct when pace changes, and apply a changed rate over its actual interval/settlement policy. Pausing or revisiting should not erase work; an estimate change alone does not grant completion or XP. Activity dots can mean “working,” while a blocked/stopped state needs its actual reason and static equivalent.

ACT NOW (done): saved the source-qualified additions. ACCOUNT FOR NOW: no duplicate book state or learning calculator. IMPLEMENTATION, linked to the existing chat: complete a native learn/read/stop/resume/finish/revisit journey; if study support is a real gap, add the smallest fitting existing-owner consumer. Sol medium for progress/rate/history, Luna low for settled UI, small/medium. Done: preserved work after stop/reload, actual rate/applicability reflected, one completion settlement, no replay on return and a meaningful local study-aid effect if added. These are implementation instructions from the later user request, not a claim they have shipped.


### Recovered additions: native implementation evidence, 2026-10-21

The later [continuation](gm/dispatch/title-rules-implementation-2026-10-21/CONTINUATION_REPORT.md)
implements practiced material insight through native recipe ownership and proves
the existing finished-book home collection's real Literacy XP consumer. One and
two copies provide the same local support; removing the physical copy preserves
learned book progress and bonuses. Native read/stop, lamp/rate/ETA expiry, resumed
work, completion and persistence use existing Book and clock owners. The
recovered source's shelf operation did not require another duplicate book state
or new per-copy reward. CRL49/50 now have runtime evidence for these bounded
routes; no claim is made for every kind of book or furnishing.

## Dojos and everyday institutions as progression, 2026-10-26

Continuation of [everyday places EL1–EL21](LIFE_SIM_NORTH_STAR.md#everyday-places-and-becoming-a-regular-round-2026-10-26).
Weibao: “what about as a progression mechanic too? Like training through the
dojos? More to consider?” This selects consideration and documentation, not a
runtime build or universal dojo ladder. All training examples below are proposals.
No fresh Proto23 or franchise source verification was performed.

Applies accepted SLR1/SLR3–SLR7/SLR14–SLR23/SLR27–SLR35/SLR40–SLR43,
AD5/AD6–AD8/AD15–AD17/AD32/AD38 and WPR21/WPR27/WPR30. The proposed GTR
palette informs legible prerequisites and alternatives; it adds no accepted gates.

### ACT NOW: clarify the existing connection (completed)

**EL22 · Everyday life already includes progression.** The previous round stressed
belonging and texture, underemphasizing training as a meaningful growth route.
Inspected `src/proto23_world_content.js` contains `instruction_handling`,
`practice_handling` and `shape_practiced`: a paid lesson plus personal rehearsal
enables a narrower material task at three minutes/two stamina instead of five
minutes/three stamina. This is source evidence of one bounded lesson-to-use
chain, not a newly verified journey or a full combat school. Treat a dojo as a
place that supplies actual learning means, not merely a social venue or XP shop.

### ACCOUNT FOR NOW: training progression proposals

| Code | Consideration | Default, dial, reason and visible consequence |
|---|---|---|
| EL23 | **The curriculum changes what you can do.** | Learn a stance or method, drill it, receive correction, try it against variation, then use it outside training. Dial the sequence by method; experienced entrants may demonstrate competence directly. Outcomes include a usable technique, steadier execution, lower effort, better timing or new practical work, with an existing consumer for each. |
| EL24 | **Practice modes supply different feedback.** | Solo forms develop repeatable execution; supervised drills correct a specific error; partner drills add uncertainty; sparring tests choices under pressure. Dial equipment, partner and teacher participation. These can improve the same underlying skill through different causes without creating four XP stores. |
| EL25 | **A school has a specialty and a limit of expertise.** | One instructor is good at defensive footwork, another at spear reach or energy control. Dial their methods and teaching competence separately from fighting strength. Seeking another teacher should open new feedback or methods rather than discard the first school's progress. |
| EL26 | **Repetition remains useful.** | Familiar drills keep improving fluency and efficiency on a diminishing curve; harder variants or correction supply new information. Dial learning rates and any genuine plateau by world/skill, naming the next route when one exists. Avoid arbitrary “beginner dojo XP stops at level 10” walls. |
| EL27 | **Rank is a second kind of progress.** | A school exam can change recognized standing, access, duties or permission to teach. Competence can precede or exceed recognition, and losing membership does not erase practice. Dial worlds where a designation also grants a real power; identify that additional mechanism and carrier. |
| EL28 | **Training transfers by the mechanism learned.** | Footwork may help several weapons, while a stance drilled against one partner needs adaptation against unfamiliar reach or terrain. Dial transfer by actual movement, perception, body and energy requirements. Do not make “dojo skill” useful solely inside its building or grant universal combat strength from every drill. |
| EL29 | **A fitting challenge is broader than a stronger enemy.** | Change distance, rhythm, equipment, visibility, terrain, restraint or a protection objective. Dial safety and lesson purpose. Meaningful failure can reveal a readable mistake without requiring injury or victory as the sole cause of learning. |
| EL30 | **Body, resources and recovery affect expression.** | Training spends actual time, effort, consumables and agreed fees. Dial intensity and recovery by the body and method; an injury can lead to adapted drills rather than deleting competence. Teacher time and station capacity constrain supervised throughput through their actual owners. |
| EL31 | **Idle training is genuine progression.** | Queue a known routine at a supported place, including partner or teacher participation when actually available. Batch gains and correction feedback in a recap; pause for important new choices. Dial routine length and supervision; active play is an option for new decisions, not a universal prerequisite to learn. |
| EL32 | **Money buys means, not an unexplained mastery level.** | Tuition pays for teaching, feedback, space or equipment. Work-for-training, public lessons, self-study, peers and patronage can provide other routes where someone has a reason and resources. A world with a real direct-transfer technique may sell that transfer, naming what changes and its costs. |
| EL33 | **Teaching is later progression with a consumer.** | Diagnose a student's error, demonstrate a method and see their execution improve. Dial preparation and teaching competence separately from personal mastery. Students may later assist with real work, carry a method or continue a school; avoid infinite self-XP merely from pressing Teach. |
| EL34 | **Schools can disagree without inventing one best ladder.** | Competing styles prioritize different situations; mixed training can reveal compatibility or conflicting habits. Dial these through actual methods, bodies and local beliefs. Rivalry, guarded lessons or exclusivity need people with reasons, not engine permission lists. |
| EL35 | **Entry and return respect earned competence.** | Offer an introductory lesson or a practical placement assessment; returning after a body/world change identifies what still works and what needs adaptation. Dial supported memory/fluency/source carry under SLR20. Do not require the same novice tutorial in every world or assume a foreign certificate is locally recognized. |

### One illustrative progression path, not a compulsory ladder

An ordinary yard's proposed thread: observe a demonstration → learn recovery
after a committed strike → drill it against a predictable pad → have a teacher
correct overextension → practice with a partner varying timing → use the recovery
against a real opponent → demonstrate it well enough to help a beginner.
Solo practice, prior knowledge, field experience or another teacher may reach
the same competence through their own costs and feedback. A simple skill can
remain a single progress value; the causal distinctions need not become seven bars.

Example feedback: “You recover your guard sooner after a missed swing.” An actual
combat consumer must make that true before such text is presented as behavior.
Example unavailable feedback: “The instructor is teaching another group. Your
solo drill is available; supervised practice resumes at the next known session.”
The schedule and alternatives must exist before this wording claims them.

### World differences, extending EL13–EL18

| Code | Setting | What progression could be about |
|---|---|---|
| EL36 | Frontier yard | Weapon handling, distance and practical defense; progress is expressed in ordinary encounters and paid work. |
| EL37 | Cultivation school or retreat | Body conditioning, circulation/control, method understanding and appropriate breakthroughs. Realm, energy supply and institutional rank remain distinct causes where the world distinguishes them. |
| EL38 | Hogwarts class or practice group | Explanation, execution, correction and application of a spell; school marks and actual casting competence need not match. Access follows the selected role and era. |
| EL39 | LOTM instruction or club | Ordinary combat, investigation, ritual procedure or a supported extraordinary method. Training does not supply a potion, promotion, source or digestion by label; an activity contributes where its actual mechanism fits the selected path. |
| EL40 | Mother of Learning teacher or study group | Understanding, repeatable execution and application; a supported loop separates retained learning from reset relationships and physical conditioning. The independent visitor branch does not gain a loop from this proposal. |

### LATER / DELEGATE: one proposed build candidate

**EL41 · A dojo lesson that changes an existing encounter.** If selected, choose
one existing training location and skill owner, add a correction/variation route,
and make its earned benefit visible in an existing combat action. Capability:
Sol medium, medium effort after seam inspection; no worker dispatched. Done check:
earned lesson → repeatable supported practice → outside application → interruption
and save/reload/export/import, with desktop 1920×1080 rebuilt evidence and AD43.
Prove practice does not replay rewards on reload, a busy teacher does not teach,
and an existing skilled character can enter appropriately. Use focused checks
that protect the selected behavior, not a new universal test suite.

Fit starts at [systems register](SYSTEMS_REGISTER.md). Reuse native skill progress,
world methods, simulation jobs, actor participation and actual combat/stat consumers
as applicable under SLR27; do not add a third learning ledger or parallel clock.
Existing command revisions and queued work need a compatibility decision before
editing a lesson definition. An existing save gains no invented attendance,
credentials or previously earned technique.

Verification: documentation and local-link checks only. EL22 is source-inspected;
EL23–EL41 are unbuilt proposals. No runtime, rulebook or accepted direction changed.

## Round 5 (2026-10-30): what the similar-games surveys add to practice, proposal only

Source: [similar games beyond protolikes](research/SIMILAR_GAMES_BEYOND_PROTOLIKE_2026-10-30.md) F3, F4, F13 and the
[protolike fork survey](research/PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md) F10; ranked in the
[absorption plan](research/ABSORPTION_PLAN_SIMILAR_GAMES_2026-10-30.md). All entries are proposals (AD32). Closed-game
numbers (DragonRealms, EVE) are not copied; only shapes are. Fit started from SLL12/SLC-P (plateau and simple repetition),
EL31 (idle training), CRL49 (books after learning) and `src/skill_expansion_content.js`; no third learning ledger (SLR27).

ACT NOW (done): this section; the plan doc records the classifications.

ACCOUNT FOR NOW

| Code | Item | Default, dial and reason |
|---|---|---|
| SLC106 | **Advance cost grows with current value.** Daggerfall Unity's uses-to-advance rises with skill value, level and a class multiplier (DFU `FormulaHelper.CalculateSkillUsesForAdvancement`, raw-checked in the survey). Deepens SLL12's plateau: the plateau is a reduced-gain cliff at mastery 4, this is a smooth curve. | Default: keep the SLL12 plateau; offer the smooth curve only for a world that wants many slow skills. Dial: growth rate per skill family. Reason: the plateau is built and verified; a second curve would be a third ledger (SLR27) unless it replaces the plateau's table. |
| SLC107 | **Absorption band.** Practice fills a per-skill pool shown as a named state; the pool drains with rest or time away, and only drained room accepts more (DragonRealms, community-reported, shape only). | Default: off. Dial: pool size, drain per rest hour, which stat lifts size. Reason: gives idle time a use that is not a bank refund, and explains why grinding one skill for hours has a soft limit without a "once". Must sit on the away-bank spend, not beside it. |
| SLC108 | **Declared study queue at a stat-set rate** (EVE shape): a learner names what they will study; it runs at a rate set by two stats, and an empty queue wastes the time. | This is EL31 plus a rate rule. Default: queue length 1, rate from the world's own learning stat. Reason: EL31 already says idle training is genuine progression; the new part is only the rate and the "empty queue wastes time" dial. |
| SLC109 | **Skill groups per tool or material family, with a content hash on the tree** (Veloren). | Family groups are LATER. The hash is a persistence rule: a changed tree shows as a visible respec event, not silent save drift. Needs the migration or compatibility decision AGENTS.md requires; old-save compatibility is currently deferred. |

LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| SLC110 | Playable slice "study hours": a declared study queue (SLC108) spent through the away bank on a book already owned, with the absorption band (SLC107) showing why the third hour teaches less. Host: lead's life, Harry Potter or LOTM book study. | Sonnet, medium; waits for the away-bank lane to land | FLR1-FLR6: a fresh-life route to the queue, panel text in UR70-UR75 shape, an existing consumer (the skill level read by a check), save/reload/export/import. Reopen when `src/away_bank_domain.js` is committed. |
| SLC111 | Read the Veloren skill curve constants and Severed Heaven's routine-wheel code before copying any number. | Haiku then sonnet, low | Raw file excerpts with paths; no number copied from the survey summaries. |
