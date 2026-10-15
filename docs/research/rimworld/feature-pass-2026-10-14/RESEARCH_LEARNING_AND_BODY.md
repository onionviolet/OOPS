# Research, learning and body fields

## RT: evidence gates and progress

`ResearchProjectDef.CanStartNow` combines unfinished status, visible/hidden prerequisites, applied techprints, required building, mechanitor, analysis, inspection and visibility. Bench availability can ignore power for selection; `WorkGiver_Researcher` and `JobDriver_Research` test actual power and linked active facilities. Thus possessing a bench does not prove the current action can run.

`JobDriver_ApplyTechprint` reserves bench and one techprint, carries it, waits 600 ticks, applies it, destroys the item and plays feedback. `ResearchManager.ApplyTechprint` fills required copy count first; once unlocked, an additional copy for an unfinished ordinary-cost project adds half remaining progress. It awards 2,000 direct Intellectual XP with learn rate ignored. This differs from normal bench Intellectual XP and does not establish scientific uncertainty.

Researcher work multiplies actor speed by bench speed, then the manager applies 0.00825, difficulty research speed and the faction/project tech-level cost factor. `CostFactor` is 1 when adequate, otherwise 1 + 0.5 per level gap with project effective level capped at Industrial. These are RimWorld constants only. Projects do not raise the faction definition's tech level in this trace.

The research window builds multiple locked-reason rows, unlike the single work-failure slot. Its analysis list can report all required analyzed items when the combined requirement fails, so do not assume every listed item is individually missing. Books add project progress through a different owner method; techprint-requiring projects are excluded by the inspected research-book validity rule. Finished status, book benefit display changes and mod definitions are not an epistemic revision history.

## P03: three distinct progress concepts

`SkillRecord` retains learned level, passion, XP since level and XP since daily reset. Effective level can include gene/trait/hediff aptitude, but book maximum eligibility reads learned level without aptitude. Positive ordinary XP uses passion, global learning, animal special factor and the saturation modifier. Saturation uses strictly greater than 4,000 earned XP, so a single award may cross the boundary. Direct XP avoids ordinary factors and daily-accounting but normally still uses passion unless ignore-rate is true. Higher learned levels have decay through interval XP; that is donor behavior, not a YAIRPG recommendation.

`Pawn_LearningTracker` keeps two active child desires, rotating after a randomized 20,000-40,000 tick interval. Seven raw Biotech desire definitions cover outdoor, drawing, radio, work watching, lessons and reading routes. `Need_Learning` is a fill/drain bar whose level feeds growth points; it is not a skill or knowledge inventory. Growth points also depend on age and child aging multiplier, with explicit vat/suspension branches.

Teaching coordinates two jobs at the same desk and checks the paired teacher/student state. The teacher chooses from the top four enabled teachable skills, not necessarily a skill higher than the student's. Both must be ready; student gains skill XP and teacher gains Social XP. Three linked blackboards can add 20% each to the learning-route factor. Work watching reads actual current recipe skill or relevant work skills while sufficiently near; losing suitable work can retarget or end watching.

Skill books retain generated skill/rate assignments and quality-based maximum learned levels (2, 5, 8, 10, 12, 14, 16). Reading calls the same pawn skill Learn method. Removing the book stops this route, not the earned XP; ordinary independent decay can still occur. Benefit text projects reader learning factors, but full reading speed/room/policy behavior remains outside this scoped trace.

## BD: separate records with explicit couplings

| Field | Storage | Inspected reader/coupling |
| --- | --- | --- |
| Gender | `Pawn.gender`, serialized by Pawn | Pregnancy pairing, biography titles, head selection, beard policy |
| Body type | `Pawn_StoryTracker.bodyType` | Body/apparel rendering, offsets; gene changes can assign it, child load correction enforces child shape |
| Head type | `Pawn_StoryTracker.headType` | Head graphic; gene forced-head sets and gender constraints select a compatible head |
| Anatomy and health | Race body plus `health.hediffSet` | Missing-part head presence, capacities, hunger multipliers, render suppression |
| Genes | `Pawn_GeneTracker` endogene/xenogene lists | Active checks include override, age and mutant rules; skill aptitude, resource behavior, body/head changes and other cached effects |
| Xenotype | Gene tracker definition/name/icon | `SetXenotype` clears xenogenes, then adds definition genes according to inheritable flag; direct setter changes designation without rebuilding genes |

`SetXenotypeDirect` is a concrete warning against treating the label as all present truth. Gene updates dirty graphics, skill aptitudes, health caches, needs and disabled-work state. Health conditions are their own records; xenogerm operations can separately add coma, shock or replication hediffs. This pass does not audit all gene inheritance/conflict/medical systems.

YAIRPG already separates inherited/trained/acquired body sources and temporary conditions in `src/body_progression.js`, and observation/understanding/ownership/practice in `src/techniques.js`. Extend one named missing reader, not a new person schema inferred from donor field names.
