# Audit: continuity, death rewards and preparation

2026-10-13. Independent audit and extension requested by Weibao. Documentation only. Findings distinguish source-visible seams from proposals; no gameplay, save, shared owner or sealed content changed. This lane owns only this file.

## F1. Authority and what the previous proposals already get right

[PROJECT](../../../../PROJECT.md#standing-priorities-and-document-authority), [USER_VISION](../../../USER_VISION.md) and [accepted continuity rules](../../../RULES_FROM_SCRATCH.md#the-heir) permit rich actual inheritance, source-specific knowledge retention, free carry and conversion on edges that support them. Heir-only code is not a limit on future design. One realm and one prestige layer remain the first milestone; this audit does not add a multiverse implementation gate.

The [preparation report](../04_PREPARING_CHEATS_FOR_NEXT_LIVES.md), [interactions](../05_INTERACTIONS_AND_CHEAT_ECOLOGIES.md), [projects/RNG](../06_AUTHORING_RNG_AND_IDLE_PROJECTS.md), [worked scenarios](../08_WORKED_WORLD_AND_LIFE_SCENARIOS.md) and [procedural model](../10_RULE_DRIVEN_PROCEDURAL_GENERATION.md) correctly separate production, preservation, delivery, recognition and use. They support strong, immediate, costless and absolute versions without compulsory balancing penalties. They also correctly distinguish learned recipes from physical objects and player unlocks from character capabilities.

The next improvement is to specify what happens between those states, particularly when death, saving, branching or a new character interrupts the expected route. More state labels alone do not resolve that behavior.

## F2. The existing succession seam is narrower than general continuity

| Source-visible behavior | Evidence | Limit of that evidence |
|---|---|---|
| Count money after one particular kit debt, bag/worn goods, chest, home, selected reputation, papers and taught lessons | [deriveHeirLeftovers](../../../../src/heir_inheritance.js), including its supplied `equippedKeys` option | Not a general registry of workshop projects, land, arbitrary magical sources or transport routes |
| Label recipient apprentice if any supported lesson was taught, otherwise kin | Same function; lesson whitelist has three IDs | Not proof of an independently identified living apprentice, a genealogical resolver or selected-recipient recognition |
| Construct a pristine new-body envelope, retain calendar and RNG input, initialize fresh expansion, copy selected `npc_lives`, options and life record | [buildLifeHeirSave](../../../../src/life_experience_host.js) | Not general preservation of old expansion world instances, institutional jobs, custody or all NPC plans |
| Papers permit later study; apprentice inheritance grants supported taught knowledge | [createHeirChronicle](../../../../src/chronicle.js) | Not arbitrary memory transfer, instant mastery of every skill or soul continuity |
| Save ended life, store succession request, reload, import successor through preflight, then remove request | [beginHeir/completeHeirRequest](../../../../src/main.js) | Source ordering and recovery intent, not a browser-tested general transaction for independent world/delivery stores |

These are bounded design shortcuts, not automatically defects in the current slice. A future system allowing named recipients and living-world projects needs explicit migration/adapters. Do not route all new preparation through the existing apprentice/kin heuristic or assume a fresh expansion contains the founder's workshop.

The observed `applyHeirLeftovers` adds physical quantities to an envelope. One-time succession behavior depends on the caller and durable transition, not that pure helper alone. A future transferable artifact needs its identity and claim semantics, not merely additive inventory counts.

## F3. A death reward needs an event, beneficiary and consequence

Separate an achievement being earned from a death-triggered effect being executed. A life may earn a start choice before dying, preserve a usable artifact through retirement, or activate an explicitly death-fed power at death. Each is legitimate; none follows from the word reward.

| Reward kind | Commit event | Actual consequence |
|---|---|---|
| Account/library option | Eligible milestone under selected mode | Adds a selectable future option; it need not provision current-character goods |
| Estate delivery | Supported succession or handover | Moves/copies declared belongings or rights to an actual recipient |
| Death-powered cheat | Declared death condition | Executes its particular revival, growth, creation or payout operation |
| World aftermath | Actual life actions and supported clocks | Leaves changed institutions, opportunities or relationships |
| Reincarnation preparation | Defined continuity edge | Retains the specified identity, faculties, records or goods |

An immediate-death strategy can be intentional in a death-cheat mode. In an ordinary legacy mode, dying does not finish missing research unless the actual rule says it does. Multiple event listeners may all react to one death, but each must identify its event and legitimate grant. Duplicate delivery from replay is an implementation error; repeated death rewards from a real repeated-death power are gameplay.

## P1. Use a transition manifest where the experience needs one

A manifest is a proposed record of the particular life boundary, not a mandatory ritual or price. An immediate perfect transfer can resolve the whole record in one action. More complex mechanisms can retain intermediate states.

| Item | Minimum question |
|---|---|
| Cause and event ID | Which retirement, death, replacement, fork or crossing caused this transition? |
| Subject and recipient | Which body/person/soul ends, survives or receives something? |
| World state | Does the old world persist, reset, fork, advance or freeze? |
| Eligible contents | What exists now and what actually meets this route's rules? |
| Knowledge basis | What does each actor know, and which claims are hypotheses? |
| Resolution | What was retained, moved, copied, transformed, lost or left unresolved? |
| Publication | What durable result becomes active and what receipt stops accidental replay? |

Proposed resolution order: observe actual boundary event; settle or interrupt affected work according to its declared policy; resolve identity/destination and applicable retention; construct a candidate state; validate; durably commit the affected envelope or explicit recoverable transaction; then publish the new life and its warranted explanation.

This does not require one global ordering for every power. A revival that intercepts death before estate transfer, and an inheritance that operates after confirmed death, need different trigger phases. Record precedence when both exist. A claim settled before revival may remain transferred, return, or produce a legitimate copy according to the selected power. Avoid letting UI order choose that outcome accidentally.

For future multi-store delivery, distinguish computation failure before commit, interrupted write, committed transition before presentation, and repeated resume. Recomputing a committed random recipient after interruption creates a different transition. Persist the resolved recipient and revision with the result. If atomic storage is unavailable, define recoverable intermediate states and idempotent settlement rather than claiming atomicity.

## P2. Identity is a relation, not one universal ID

Keep body identity, soul/person continuity, genealogical relation, branch origin, role/office and player-controlled character distinct where the selected mechanism uses them. A bloodline lock may care only about descent. An office artifact may accept a legitimately appointed successor. A soul key may accept two forked selves if its actual law does so.

| Situation | Decision required |
|---|---|
| Original and clone coexist | Do both qualify, only one, or different functions? Ownership does not follow resemblance alone. |
| Returning soul without memories | Recognition can succeed while comprehension fails; a perfect teaching function can resolve both. |
| Possessed body | A body-key and soul-key can disagree; determine who operates the object rather than equating occupant with owner. |
| Earlier branch counterpart | Similarity is not evidence that this person made the same project or knows its method. |
| Creator revived after inheritance | Revival does not silently annul a completed gift; specify retained rights and actual reversal power. |
| Different next player character | The old recipient/world can still exist even when the player starts elsewhere. |

A copy can be a new independent person; a perfect continuity law can declare it the same continuing person. Neither ontology is compulsory. Apply the chosen law to memories, decision authority, possessions and observers consistently. Legal/social recognition can differ from the artifact's actual recognition.

## P3. Future planning is also an information problem

Separate intended future, predicted future, promised service, proven mechanism and committed destination. A plan based on a simulator inherits that simulator's model and uncertainty. A genuine perfect forecast can be certain; do not impose noise merely to preserve mystery.

A prepared future character should not receive the player's complete project knowledge unless something supplies it. A written manual can preserve facts while omitting tacit technique, assumptions or later revisions. A memory cheat can preserve all of them. Observation records should identify their origin sufficiently for diagnosis without exposing sealed author truth.

More possibilities: a founder writes alternative instructions for different recipient bodies; apprentices annotate a mistaken theory; a later world invents better tools; an institution changes its mission; an autonomous workshop requests permission to revise the old plan. A recipient may use the mechanism effectively while rejecting the founder's ambitions. These create choices rather than mandatory betrayal arcs.

## P4. Unexpected death and unfinished projects need selected policies

| Project situation | Possible authored outcomes |
|---|---|
| Paid fabrication underway | Stop with materials reserved, finish through a surviving operator, refund permitted inputs, or produce defined partial output |
| Research observation complete but report unwritten | Knowledge survives only through an applicable memory/record/observer mechanism |
| Recipient designated but delivery uncommitted | Keep the will as a claim, execute an eligible automatic service, or leave delivery pending |
| Courier dies after collection | Cargo remains at its actual location; an autonomous recall/duplication power may supply another result |
| Institution continues | It spends its own resources under supported policies; founder death is not a free infinite-production grant |
| Absolute self-completing project | Complete exactly as its declared authority permits, without invented interruption penalties |

Clocks are equally specific. A frozen old world does not finish its job merely because the new character played a year. An advancing one may finish, decay or change. Lazy simulation can resolve supported changes upon return, preserving prior facts and declared fidelity. Generation of a later recipient must respect already established relations and unique objects.

## S1. The borrowed-instrument school

Original canon-compatible-in-shape project, not a claim about any particular franchise. A researcher borrows a comparison instrument, learns a supported procedure, makes a manual and establishes a small school. The intended next character is an apprentice; the player instead chooses a stranger in a distant region.

**Script/rule/RNG/work:** author the supported observation and teaching scenes; model loan custody, real learning and independent school resources; optionally generate pupil candidates from actual eligible people; queue transcription and known lessons. Recipient appointment is a choice, not automatically the player identity.

| Boundary | Retained | Lost/not granted | Uncertain or deferred |
|---|---|---|---|
| Founder unexpectedly dies | Completed manual, taught pupil knowledge, actual school stock | Borrowed instrument does not become estate property; founder's unrecorded insights do not automatically transfer | School survives according to its supported staff, stock and clock |
| Player starts as stranger | Stranger's own knowledge and means | Automatic access to founder's school and founder memories | A discoverable lead/contact route if this world and profile support one |
| Apprentice continues | Actual learned procedure and entrusted manual | Universal mastery or ownership of every founder possession | Whether to teach, revise, close or relocate the school |

Useful payoff: pupils perform a repair using the taught method; the stranger can later learn through an actual route. The founder's achievement remains consequential even when it is not a start-menu power. A freely accessible school version can omit restrictive access entirely.

## S2. Two selves, one traveling orchard

Original AU premise: a pocket orchard survives through a declared branch-making power. The creator forks into two living continuations. The selected version copies the orchard at branching, with each copy acquiring its own mutable history; it does not make one inventory simultaneously spendable in both branches.

**Script/rule/RNG/work:** author a first branch choice and observations; implement explicit snapshot/copy semantics, tree growth and harvest consumers; optionally resolve eligible destinations once; queue cultivation under each branch's clock. A stronger synchronized-orchard variant would be a separate shared-state operation, not an accidental consequence of copying.

| Boundary | Retained | Lost/not granted | Uncertain or deferred |
|---|---|---|---|
| Fork commits | Initial design, declared trees and knowledge in both legitimate copies | Automatic later synchronization, knowledge of the other self's decisions | New destinations only if not fixed by this power |
| One self revises irrigation | That branch's revision and actual crop effects | Other branch does not inherit the edit automatically | Later communication/translation if supported |
| One self dies and appoints an heir | Its surviving orchard and eligible records under that branch's inheritance law | Another branch's harvest cannot be claimed as this estate's output | Heir's acceptance and selected recognition rule |

Useful payoff: two different cultivation plans produce independently useful crops. Save/import retains lineage, local quantities and each completed claim. A claim key must include the applicable branch/domain; otherwise legitimate copies might block each other. A unique-transfer version instead moves one orchard, and a perfect shared version explicitly coordinates one common orchard. All remain valid alternative premises.

## S3. The delayed blueprint delivered to an unfamiliar body

Original reincarnation AU: an engineer can retain a blueprint through death and steer the next life toward a compatible world, but cannot guarantee a body type. They create a repair-tool design, test its first function and begin an optional sensory module. An unexpected death occurs before that module is completed. The next body cannot operate the old hand controls.

**Script/rule/RNG/work:** author accessible tests and adaptation decisions; represent finished functions and partial evidence separately; commit a compatible destination/body draw once where genuinely random; queue known construction. Soul retention is an explicit AU change, not an inferred book-world property.

| Boundary | Retained | Lost/not granted | Uncertain or deferred |
|---|---|---|---|
| Death | Finished blueprint and specified remembered evidence | Physical tool/materials if the selected edge carries only information; no finished sensory module | Any incomplete experiment's actual unresolved result |
| New life | Supported retained design and its provenance | Prior body's motor skill unless explicitly retained; guaranteed nearby fabrication supplies | Availability of local translation, collaborators and workshops |
| Adaptation | New interface revision and tested output | No automatic equivalence to the old device's whole behavior | Unexamined functions remain unverified in the new profile |

Useful payoff: hire a collaborator or redesign the interface, fabricate a working version and complete one repair. A perfect creator version immediately supplies the compatible tool. A no-memory variant can deliver the same blueprint through an actual archive instead. The chosen rule determines the obstacle; difficulty is not universally required.

## P5. Compatibility and migration must preserve actual facts

Persist resolved artifact/project data, relevant law revisions, commitments and lineage where needed. Generator seed alone cannot reconstruct facts after rule changes. Existing apprentice/kin records should retain their original meaning rather than being rewritten into invented named NPC histories.

If a new named-recipient system is added, an explicit compatibility choice could keep legacy heirs as their old simple mode, migrate only relations supported by old evidence, or request an optional player selection at a safe boundary. Missing history is unknown, not proof that an apprentice was secretly a particular actor.

Do not upgrade every old blueprint into the newest definition. A migrated effect must preserve or explicitly transform its pending work and downstream applications. Unsupported generated definitions can remain readable dormant records when that is the chosen compatibility policy; rejection must preserve the original save. Exact behavior is an implementation decision, not settled by this audit.

## A1. A bounded implementation and evidence plan

Candidate only: in one realm, author a usable written procedure, actual appointment/custody and one future recipient's useful application. Keep death/retirement modes supported by that slice; do not require multiversal machinery. If stronger carry is selected instead, implement that precise edge rather than fake it through heir labeling.

Meaningful checks would cover empty inheritance, papers versus taught knowledge, changed/no recipient, unfinished work, replay/resume, failed writes and legacy saves. Branching needs its own copy/unique/shared semantics checks when added. Native acceptance needs a fresh rebuilt desktop/laptop origin, natural preparation, useful successor result and exact save/reload/export/literal-import evidence. No such test was run here.

## Checks and gaps

Read the five requested reports and live authority; inspected four source files and the existing test-file names without executing tests. Verified this document's relative links and whitespace only. No browser, build, gameplay, personal-save, book acquisition or runtime write occurred. Current source was inspected while the checkout already contained unrelated changes, all preserved. Named book continuity, exact transition law, durable multi-store protocol, generalized identity resolution and a selected playable route remain open proposals.
