# Skill and learning rules

**Proposal, 2026-10-18. Not accepted until Weibao says so (AD32).** Drafted for
every agent that designs or builds skills, methods, techniques, practice,
lessons, teachers, manuals, talents that change learning, rust, skill loss, and
what skills do across lives, bodies and worlds. Weibao, 2026-10-18, on gap G3:
"work on /more-to-consider on this and implementation and improvement and more".

Each rule names the mistake it prevents. Rules marked **(standing)** or
**(accepted)** restate an existing rule or accepted decision and bind now through
it; the rest are proposals. Sources: [round 1 of the skills and learning
palette](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md) (SLC codes),
[Skills and talents](SKILLS_AND_TALENTS.md), [skill mechanisms and
means](worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md) (M codes),
[making rules](MAKING_RULES.md#mastery) and the [continuation
owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md) (CA2). Every rule
is a default; a world may state an exception with an in-world reason and cost.

## Layers

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR1 | **Competence has layers on different carriers:** understanding (memory), fluency (the body or faculty the practice shaped), source (core, pool, pact, grant; its own custody) and expression (derived now from body, tools and world). A world may collapse them when they never come apart. (SLC1–SLC3) | "Level 7 swordsman" meaning the same thing in a baby's body |
| SLR2 | **Mastery improves control, not truth (standing, MR21).** | Skill that changes what iron or an herb is |
| SLR3 | **Expression needs actual means (accepted, AD6, AD38, CA2).** A method works wherever its mechanism works, and only there. | Skills that work by label in a world without their mechanism, or fail by label where the mechanism is present |

## Gaining

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR4 | **Every gain has a cause** (practice, instruction, text, demonstration, failure, insight, absorption, grant), and the cause decides which layer moved. Record the cause when a later system reads it. (SLC5) | Skills that appear with no answer to "where did that come from?" |
| SLR5 | **Deliberate learning needs new information (standing, MR22, generalized).** Harder variants, new materials, readable failures and corrections teach; repeating a mastered identical task teaches little. Volume-based fluency (native per-tick XP) is a separate legitimate model. (SLC6) | Infinite mastery from one repeated click, or vanilla XP rewritten to fit |
| SLR6 | **Feedback is a means.** Teachers, measuring tools, partners and readable outcomes raise what practice yields. (SLC7) | Tools and teachers that add nothing to learning |
| SLR7 | **Learning rate is an adjective** per world, body, skill and talent: challenge band, consolidation, aptitude. No universal formula. (SLC8, SLC9, SLC11) | One XP curve forced on every world |
| SLR8 | **Grants and aptitudes name the layer they give or multiply.** (SLC10, SLC11, SLC33) | A crossing that cannot tell whether a learned spell carries |

## Holding and losing

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR9 | **Loss names its layer and cause.** Ambient decay needs a world reason. (SLC13) | Skills that drop with nothing to prevent or repair |
| SLR10 | **Rust is a per-world dial, off by default.** When a world turns it on, it hits fluency by default, with a stated reason. (SLC14) | Upkeep chores in an idle game |
| SLR11 | **Regaining is faster than first learning (savings)** while understanding remains; the rate is a world and body dial. (SLC15) | Rebirth, rust and recovery that reset to zero |
| SLR12 | **Injury and body change lower expression before mastery** (pairs with proposed BHR13). Healing restores it; a lasting change may need adjustment practice. (SLC16) | A broken arm deleting swordsmanship |
| SLR13 | **Taken skills are conserved where the mechanism is transfer;** seals block expression and leave the skill in place. The simulation's copy and transfer operations are the model. (SLC17) | A stolen technique that vanishes from the universe |

## Teaching

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR14 | **Teaching passes understanding and feedback;** the student still builds fluency. A means that transfers fluency or memory directly works by its mechanism and says so. (SLC20, AD38) | Paid lessons that hand over finished mastery |
| SLR15 | **Teachers teach only what they hold, through means (accepted, AD6).** Teaching ability is its own competence. (SLC21) | Every NPC as an omniscient tutor |
| SLR16 | **Lessons are transactions** with consent, price, time and access, and guarded methods have keepers. (SLC24) | Free instant teaching from anyone present |
| SLR17 | **Same rules for every learner (standing, MR23).** Apprentices, heirs, NPCs, constructs and the player learn through one resolver. (SLC25) | Two learning economies and two balance passes |
| SLR18 | **Texts are claims with a source** and can be wrong or partial; testing settles them. (SLC26, BHR8) | Every manual treated as correct |
| SLR19 | **Rank and competence are separate facts.** A certificate, rank or office is recognition and access, not skill. (SLC27) | Revoking a title erasing what someone can do |

## Carrying across lives and worlds

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR20 | **Each layer carries by its carrier (accepted, AD11, CA2).** Understanding follows the journey's memory; fluency stays with the body; sources follow their custody; tools and notes follow item custody. (SLC28) | Full power in a new body, or full erasure of what the soul knows |
| SLR21 | **Carried understanding regrows fluency at a savings rate** in the new body, up to the remembered level by default. (SLC29) | Rebirth as either a free power copy or a pointless reset |
| SLR22 | **A carried skill without a mechanism in the current world is dormant:** known, shown and unexpressed, with a reason the character can know. Erasure needs a world reason and a warning. (SLC30, SLC35) | Skills silently deleted at a world border |
| SLR23 | **Methods can outlive their learner** through students, records and institutions, and later lives meet them as world facts. (SLC31) | Teaching with no lasting effect |

## Knowing and showing

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR24 | **Own skill numbers are exact (accepted, AD8);** the layer split appears once it exists. Others' skills are learned through means. (SLC34) | "???" on your own skills, or clutter on vanilla play |
| SLR25 | **Hidden and emergent skills surface through use or a fitting means (accepted, AD3).** (SLC35) | A skill list that spoils a world's secrets |
| SLR26 | **Away-time learning is batched in the recap (accepted, AD17).** (SLC36) | Forty level-up toasts on return |

## Implementation

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR27 | **One authority per learning fact; project, don't merge.** Native skills keep `skill_progress`, simulation methods keep `powers`; new learning facts go in a namespaced slice (AR6) with their layer and carrier named, and native XP needs no migration. (SLC37, SLC41, SLN1–SLN4) | A third skill store, or a migration of every old save for a design lens |
