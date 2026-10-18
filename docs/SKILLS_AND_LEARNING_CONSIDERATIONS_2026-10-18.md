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
| SLC5 | **Every gain has a recorded cause:** practice, instruction, text, demonstration, failure, insight, absorption or grant. No store records the cause today (SLC37). The cause decides which layer moved (a book moves understanding; drills move fluency) |
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
| SLC37 | **Two skill stores.** Native skills: `Skill` in `src/models/skill.js` (XP curve, parents, milestones, xp multipliers), progress in the levelable component's `skill_progress`. Simulation methods: `state.simulation.powers[actor][id] = {owned, mastery, executions}` fragments and a donor; a per-actor `sources` map holds power sources with expiry (the source layer of SLC3, not a learning-cause record). Mastery rises only through an authored `mastery` effect; `copy` and `transfer` operations already move a power between actors, with `copyMastery` optional and `transfer` clearing the donor (`src/simulation_effects.js:380-401`) | Do not merge them. A read-only layer projection can present both: native XP as fluency, simulation mastery as fluency, actor `sources` as the source layer. Copy versus transfer already models SLC17 and SLC20's direct-transfer case; no cause record exists yet. One authority per fact (AD7, AR) |
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
