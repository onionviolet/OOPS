# Rulebook implementation considerations

2026-10-14. Completed bounded planning report. **Recommendation: recover and finish the existing clearance-manual acceptance route before adding another study system.** If a new feature is requested afterward, use a small, authored text-assisted research branch with one useful output. Ars Magica supplies strong distinctions for that design, GURPS supplies precise effect construction, and The Strange supplies a deliberately different crossing model. None requires a universal tabletop interpreter.

This report authorizes no gameplay change, new world priority or acceptance attempt. It is a proposal for review. Only this report area, private preparation metadata/index and [CATALOG.md](../CATALOG.md) were changed. No runtime code, shared product owners, source originals, saves, commits or external messages were changed.

## D1. Authority and scope

Read [brief](../handoffs/IMPLEMENTATION_BRIEF.md), [world-rules guide](../WORLD_RULES_GUIDE.md), [README](../README.md), [adaptation plan](../CORE_TITLES_AND_ADAPTATION_PLAN.md), [design considerations](../DESIGN_CONSIDERATIONS.md), PROJECT.md's standing direction and relevant summaries, USER_VISION.md's tabletop direction, and the relevant multiverse/ability owners. These establish multiple possible world-system families while preserving the continuing traveler, actual means and canon-first priorities. The first milestone remains bounded. Desktop/laptop is primary; mobile optimization is deferred. Ars Magica is a research example, not the next adopted world.

Live design owners: [multiverse structures](../../../worlds/MULTIVERSE_STRUCTURES.md), [ability authoring](../../../worlds/ABILITY_AUTHORING.md), [progression and assembly](../../../worlds/PROGRESSION_AND_ASSEMBLY.md). Source-informed alternatives below do not amend them. The existing [Strange research](../../the-strange-tabletop/RECURSIONS_AND_TRANSLATION.md) already separates translation, physical passage, local law and custody. This pass adds bounded core-book reading rather than another competing specification.

The checkout contains substantial concurrent dirty work. Reads established relevant source capabilities, not an exclusive runtime reservation. The delegated brief explicitly reserves this report area and the bounded library refresh. Any later shared implementation or native Foundation continuation must recover its then-current owner and checkpoint; this report does not release another worker's files or revive a stopped attempt.

## F1. What was actually read and prepared

Exact local source excerpts, hashes and locators are saved in [private exact rules](private/EXACT_RULES.md) and [reading ledger](private/READING_LEDGER.json). Public prose below paraphrases. Four selected sources were inspected; no full-book read is claimed.

| ID | Source and coverage | Exact locators | Limits |
|---|---|---|---|
| S1 | Ars Magica Definitive Edition Core Rules, repository `reviewed` text at `fd0e31fc3e1a7265adc059908dc00a60cbc4a515` | Chapter 8, Basic Laboratory Activities / Inventing Spells, lines 10330–10444; Laboratory Texts through Distractions, 10745–10838; Advancement through study Distractions, 16061–16216 | Selected rules, not whole core. Markdown line/heading locators take precedence over page references embedded in the text. Do not silently mix this edition with the separate WIP 5e core. |
| S2 | Ars Magica 5e Covenants, same repository revision, `reviewed` | Hermetic Book Cycle, lines 4944–5005; Chapter Nine, standard laboratory, equipment, routines and characteristics through specializations, 5592–5779 | Selected passages. The core and older supplement overlap; they have not been reconciled into a single canon ruleset. Manufacture-of-books passages were sampled, not used to specify an ink economy. |
| S3 | GURPS Basic Set: Characters, internally Fourth Edition, third printing, February 2008 | PDF pp.2–3 edition/title; pp.63–64 / printed 61–62 Innate Attack; PDF p.103 / printed 101 Modifiers; PDF p.112 / printed 110 Accessibility; PDF p.114 / printed 112 Limited Use; PDF p.116 / printed 114 modified attacks and Preparation Required; PDF p.117 / printed 115 Reduced Range | Selected pages. Campaigns prepared but unread. No claim to have read Powers, Thaumatology or Infinite Worlds. |
| S4 | The Strange core, local PDF | Chapter 9: PDF pp.127–129 / printed 125–127 translation definition, initiation and cooperation; PDF pp.131–133 / printed 129–131 arrival, wards, abeyance, cyphers, keys and healing | Selected pages. No complete focus catalogue, failure table or inapposite-gate chapter read. In Translation is not a substitute for this core reading. |

The existing manager completed a preparation refresh: 72 manifest records, 71 present records, 70 distinct present hashes, 7,371 counted PDF pages and 31,371 indexed records. These are inventory/extraction counts, not reading counts. Four of the 11 newly added records prepared; seven failed parsing. [Catalog refresh](../CATALOG.md#f3-preparation-refresh-for-11-added-local-records-2026-10-14) names each. In Translation also failed an alternate bounded Poppler read. Its filename establishes presence, not readable source coverage. No original was repaired, moved or rewritten.

The manifest intentionally retains `not_read` full-book states. This report and its ledger establish selected-section reading only. A successful extraction does not validate every PDF page, internal title or completeness.

## F2. Study and invention are different outputs

**Source rules, S1.** Learning from a book raises an Art or Ability subject to the source's quality and, for a summa, its level ceiling. A tractatus benefits a given reader once; writing or acquiring another copy does not create new intellectual content. Literacy, language and prior eligibility matter. A supernatural book is not automatic acquisition of its faculty. Teaching also has teacher capacity, language, level and time requirements. Training while working and dedicated teaching are distinct arrangements.

Laboratory invention instead produces a particular defined spell. Its Technique, Form, range, duration, target, limits and level must be settled first. Basic Lab Total combines relevant Arts, Intelligence, Magic Theory and aura. Without a text, the total must exceed the level; each season contributes the excess toward the level. For example, total 25 against level 20 produces five research points per season, requiring four seasons. A usable Laboratory Text changes reproduction to one season when Lab Total meets or exceeds the effect level. It does not permit arbitrary edits to that effect. Personal shorthand may need decoding. A text is neither a learned spell nor a casting tablet; the latter can permit constrained execution without supplying the former's understanding.

**Interpretation.** There are at least three independently valuable rewards: better general competence, a learned executable method, and an external record that helps another research attempt. Collapsing these into one “knowledge unlocked” flag loses meaningful choices.

**YAIR proposal.** Retain existing knowledge, source, power and item owners. Author a specific method and its real consumer. A reference record can shorten a supported research route without granting its bodily faculty, charge, institutional permission or execution. A self-invention route can remain available where the world supports it. Books and teachers need not be mandatory prerequisites for every ability.

**Idle consequence.** S1 uses seasonal advancement as an abstraction for many ordinary occupations, while Hermetic lab work occupies an actual season. Lab interruptions have their own rule; general-study distractions use a different one. Do not convert both into one global interruption penalty or make a season equal a real-time wait. YAIR should choose played-time duration, actor occupancy and interruption policy for the particular authored job. Browsing away or closing the app must not imply a newly implemented offline scheduler.

## F3. A home creates choices through support and opportunity cost

**Source rules, S2.** Books enter a continuing library through selection, acquisition and preparation for use. Their relevance changes as residents develop. Laboratories need actual space, equipment, arrangement and maintenance. Refinement, specialization, quality, safety and upkeep have different effects. In particular, a lab bonus for one activity is not automatically improved book study or teaching. Unsafe and warped laboratories can produce outcomes whose specifics require storyguide judgment. Assistants have their own eligibility, time and learning consequences in S1.

**YAIR proposal.** Make one existing bench or library worth returning to through its actual supported function. Reserve that facility and the participating person's attention. A helper may perform their own paid work while the player does something compatible, but cannot be spent as an unlimited passive bonus. Retain the same book, worker, workspace and resolved result on return. Ordinary life, trade and residence can remain useful after the unlock.

No general covenant budget, annual upkeep simulation, apprentice society or laboratory accident generator is recommended for this slice. Those require additional consumers and source reading. Source-sanctioned non-standard laboratories also warn against turning the standard laboratory checklist into an absolute metaphysical prohibition.

## F4. One precise GURPS construction

**Source example, S3 printed p.114.** The book constructs a dragon-breath attack from four dice of burning damage, a five-yard cone, three uses per day and reduced range. The printed price is 32 character points. The inspected base cost is five points per die, so the example's modifiers of +100%, −20% and −20% turn a base 20 into 32. The formula is a GURPS character-budget calculation, not YAIR mana cost, cooldown, XP requirement or damage conversion.

The useful structure is functional: damage type and amount, delivery geometry, reach, usage budget and reset rule. General description can suggest additional uses, but the text explicitly leaves approval to the GM. Calling something a water jet does not automatically implement extinguishing a fire. Accessibility likewise depends on the campaign and actual restriction; its point discount does not establish the restriction's metaphysical cause.

**YAIR mapping.** Ability metadata can bind concrete commands, sources, targets, controls, carriers and counters. A modified attack still needs its native effect consumer, ordered costs and actual target. A shared source can have multiple operating modes without creating independent inventories or abilities. Any thermal, fire-extinguishing or multi-target interpretation needs an authored supported interaction; this report supplies none.

The existing structured compiler supports bounded function families and validates real effect types. It does not implement a general cone resolver, GURPS points or arbitrary modifier composition. A future attack would need those actual consumers before the descriptive envelope could count as gameplay.

## F5. One Strange boundary interaction

**Source rules, S4.** Translation changes the traveler's contextual body, equipment and usually focus while preserving descriptor, type and most stats. It moves consciousness into the destination form rather than transporting the original body. The old form and ordinary equipment go into abeyance and return with that recursion. Cyphers generally cross in changed local forms while keeping their powers. Arrival usually uses the initiating traveler's previous departure point, with authored defaults for first visits. Keys can specify another site. Wards can obstruct entry or exit. Translation ordinarily provides no healing. Some effects lack support under a destination's laws, fade there after a minute, and return when the required law is available again.

**Worked interaction, source-supported interpretation.** A traveler leaves recursion A with ordinary laboratory notes, an active injury and a cypher. Under the inspected translation default, the notes stay with A's equipment rather than becoming a free physical copy in B; the cypher may take a B-appropriate form while retaining its effect; the injury does not become a travel heal. Return recovers A's prior form/equipment and prior location subject to the connection's actual exceptions. This establishes neither universal memory-based reconstruction nor a right to reproduce the notes commercially.

**YAIR proposal and limit.** This is one possible connector type, distinct from the existing retained-body physical doorway. The current native traveler adapter explicitly models a narrow conventional one-body profile and retained-method view, not general Strange translation. Its narrow method list is not a catalogue of everything the player can remember. Reusing physical cargo movement for abeyance would misrepresent the source. A full translation branch needs separately owned body/equipment state, shared injury rules, focus support and atomic return handling. That is a larger, lower-ranked project. No universal suppression, equalization, compulsory transformation or erasure of earned powers follows from this source.

## F6. Current engine map, verified by source inspection

These are source-level capabilities. No tests, build or native play were run for this report. Historical native evidence stays with its original reports and inputs.

| Existing area | Inspected owner and capability | Consequence / bounded gap |
|---|---|---|
| Manual acquisition and comprehension | [steam_boh_content.js](../../../../src/steam_boh_content.js), [runtime](../../../../src/steam_boh_runtime.js), [facts](../../../../src/steam_boh_facts.js), [host](../../../../src/steam_boh_host.js): paid copying, a disclosed failed trial, fatigue/recovery, self or guided comparison, reading, retained procedure and three-minute two-kit work | Already covers much of the suggested book chain. Source validator disallows automated programs for this packet. Do not promise a queue without changing that explicit contract. |
| Learned power versus charged carrier | [reference_gameplay_content.js](../../../../src/reference_gameplay_content.js): Eda's measured cooling, paid supervised practice, finite sleeve charge, retained empty sleeve, resin and useful hook control | Existing functional distinctions fit rulebook ideas. A renamed “magical study” card would add no behavior. |
| Authoring | [structured_ability_runtime.js](../../../../src/structured_ability_runtime.js), [structured_pack_definitions.js](../../../../src/structured_pack_definitions.js): compile supported definitions into commands/powers with source, control, target and completion requirements | Reuse these seams where applicable; they do not execute all tabletop rules. Namespaced carrier validation is not general foreign-source interoperability. |
| Invention planning | [invention_planner.js](../../../../src/invention_planner.js): authored alternatives, AND requirements, least-fixed-point feasibility, cycles and knowledge-filtered roadmap | Can explain a known route and reject circular prerequisites. A feasibility witness does not reserve scarce resources, schedule time or create a learned output. |
| Jobs and publication | [simulation.js](../../../../src/simulation.js), [expansion_persistence.js](../../../../src/expansion_persistence.js): reserve/complete/cancel, actor/site occupancy, common-clock boundaries, validated full-envelope serialization before publication | Reuse the same transaction owner. At a common boundary, jobs settle before later expiry/check/actor-decision handling; a study extension must account for that order. |
| Discovery and controls | [skill_discovery.js](../../../../src/skill_discovery.js), adventure notebook and existing feature presentations | Filter knowledge before search/count; accepted-work display must not expose frozen future outputs. Show actual remaining time, known block and cancel terms. |
| Traveler and instance identity | [native_realm_traveler.js](../../../../src/native_realm_traveler.js), [pocket host](../../../../src/pocket_realm_host.js), [realm rules](../../../../src/realm_boundary_rules.js), [world instances](../../../../src/world_instances.js), seeded streams | Existing physical passage calls traveler/cargo previews. Instance/schema/stream helpers are available, but those helpers alone do not prove every generated person/project is durably integrated. Translation/abeyance remains a different contract. |

## I1. Interactions to account for now

| ID | Interaction | Required design consequence | Disposition |
|---|---|---|---|
| I1 | Copying, lending and one-use study | Physical copy identity and intellectual work identity differ. A per-reader tractatus benefit cannot reset by copying, translation, renaming or import. Existing counted manuals do not yet establish unique-copy research identity. | Account for now if such a source is adapted. |
| I2 | Knowledge, means and permission | Understanding a cooling method does not supply a charge, compatible body, authorized workspace or teacher consent. A foreign license is neither foreign competence nor a universal usage ban. | Preserve existing distinctions. |
| I3 | Parallel work and idle scheduling | Self-study occupies the student; guidance also occupies a real teacher; a separate worker may continue compatible tasks. Recheck support at completion and define who owns interrupted inputs. Closed-browser time and off-world time need explicit policies. | Account for now; no new global scheduler. |
| I4 | Cross-world combinations | A foreign reference can inform a local design without becoming executable. A real cooling carrier might affect an explicitly compatible process; a foreign practice could improve control only after supported testing. Tag similarity never proves compatibility. | Later, one actual consumer at a time. |
| I5 | Procedural validity and durable generations | Generate bounded opportunities against actual reachable suppliers, references, workspace and alternatives. Persist selected definitions/revisions, people, copies, results and unique claims. Preserve outcomes on reload; a seed alone is insufficient. A valid dependency graph can still be unaffordable or miss a deadline. | Account for now for generated content; keep first extension authored. |
| I6 | Changed body or local authority | Learned method, embodied faculty, source, injury and right of access have independent owners. Suppression or temporary absence must not delete learning; return must not create a healed duplicate body or second item. | Existing owners first; broader translation later. |
| I7 | Research uncertainty and discovery | Human-GM classifications, spell levels, side effects and noncombat interpretations need authored rulings. Choose them before commitment, preserve result/provenance and reveal through actual observation. | Freeze bounded rules; unsupported requests get a useful known limit. |

## O1. Ranked recommendation

| Rank / ID | Next unit | Benefit and cost | Status |
|---|---|---|---|
| 1 / O1 | Recover the current Foundation owner and assess closing the existing FA10 manual's remaining natural study/use/persistence proof | Tests the already implemented connected chain with no new subsystem. Procurement, playable budget and ownership recovery are real costs. | Recommended immediate follow-up, only under a new bounded authorization. |
| 2 / O2 | One original text-assisted research branch producing one alternate method in an existing active location | Adds invention rather than another manual wrapper. Requires one new output consumer, acquisition alternatives and persistence decisions. | Proposed implementation slice after O1 or a later explicit priority decision. |
| 3 / O3 | One compatible foreign carrier changes a real local work outcome | Exercises cross-world combination without universal conversion. Needs actual cargo/source support and a consuming local resolver. | Later; do not bundle into O2 acceptance. |
| 4 / O4 | A Strange-style translation and return with abeyance | Strongly distinct multiverse behavior, but needs body/equipment/injury/focus lifecycle work beyond physical passage. | Defer pending chosen world and broader source packet. |

No additional purchase is needed for O1 or the bounded design of O2. Unread expansion books are opportunities, not required dependencies.

## A1. Concrete recommended follow-up and visible gate

O1 is an acceptance task, not new implementation. The [R5 report](../../../gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r5/REPORT.md) records actual manual commission and pending/completed restoration, while its [backlog](../../../gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r5/ACCEPTANCE_BACKLOG.md) leaves trial, fatigue, recovery, comparison, reading and learned-kit production open. This pass verified that those routes still exist in current source; it did not establish that R5 is the latest runtime authority. Recover the live checkpoint before selecting any attempt, artifact or budget. The stopped R5 allowance must not be extended implicitly.

Proposed target: desktop 1366×768, plus a wider laptop layout if the existing owner requires it. Visible outcome: the same owned manual supports learning through the existing independent or guided preparation route, followed by two actual kits with disclosed inputs and useful downstream use. The player can distinguish finding a gap, learning a procedure and having the means to execute it. Mobile optimization, new worlds, covenant management and a universal study UI remain deferred.

A fresh bounded packet should preserve five acceptance groups:

1. **A1:** Recover owner, real earned state, acquisition route and a viable played-time/resource budget. Stop if the route is not supported; do not manufacture supplies.
2. **A2:** Exercise naturally reached study/comparison/read states and a materially different existing alternative or control within the chosen scope. The route need not force a failed trial when guidance legitimately skips it.
3. **A3:** Complete learned production and use its actual output. Check conservation, retained learning without a copy, and honest blocking when execution still requires one.
4. **A4:** At pending and changed-positive states, perform Save, reload, Export and literal-file Import through native controls. Compare inputs/reservations, worker means, clock, learned version, inventory, conditions, source state and jobs. Cancellation/support-loss checks must detect duplicate refunds or paid-but-unearned learning.
5. **A5:** Rebuild and bind served bytes before fresh-origin browser proof. Verify keyboard/focus and meaningful action visibility at the target viewport. Record source, native, persistence and director-taste results separately.

These are proposed follow-up checks, not new requirements imposed on unrelated active waves. Existing source checks can guide a packet, but do not replace its natural route or persistence proof.

## D2. If new implementation is requested: freeze O2 this narrowly

A candidate original extension would let the player research one new bench method from independently acquired evidence, with an optional complete reference that shortens the work. Pick the actual method only after checking current content for duplicates and receiving scope approval. The existing clearance comparison must not be renamed and sold as the new branch.

One authored target, two ways to reach the same supported learned method, one native consuming action, one durable aftermath. No random spell names, user-entered code, free-form GM or full Ars setting. Research time and outputs are YAIR design choices. Source fidelity requires labeling it as inspired behavior unless the exact edition and complete chosen rule are adopted.

Use the current definition/command/effect pattern. Proposed authoring fields are a stable method ID and revision, source locator/provenance, requirements, job duration and reservation policy, result effects and a consuming command. They are not a new universal schema. Save only state that cannot safely be derived: actual accepted job/support revision, paid inputs, progress if genuinely multi-stage, understood method, physical reference/custody if represented, resolved outcome and provenance. Freeze accepted parameters; recompute current eligibility without silently rewriting past work. Optional absence in an old save stays inert. An incompatible active definition needs migration or an explicit preserved-old-reader decision, not automatic re-enrollment or re-awarding.

The desktop presentation can use the existing local-actions and work surfaces: known goal and alternatives, current reason blocked, committed work/time and a result receipt beside useful production. Author-only inspection can expose validation/provenance; player-facing prose should describe the situation and costs without engine IDs or hidden truth.

## U1. Unverified assumptions and human judgments

| ID | Unverified item | Consequence / next evidence |
|---|---|---|
| U1 | Current runtime availability, latest ownership, viable earned artifact and legal new native budget | O1 cannot start from this report alone. Read current checkpoint and reservations; source presence is insufficient. |
| U2 | All pages, editions and completeness of newly inventoried books | GURPS title pages were checked; seven additions failed preparation. Do not treat filenames or index counts as validated books. |
| U3 | Exact Ars edition reconciliation, arbitrary spell level, suitable correspondence, accident/warping specifics and general noncombat power uses | Human-GM judgments remain. Freeze a chosen ruling or bounded authored table before execution; no general automatic interpreter is demonstrated. |
| U4 | O2's actual missing method, rates, utility, balance, fatigue policy and idle/absence behavior | Candidate planning only. Check for existing consumers, choose a useful method and justify numbers with the local world owner. |
| U5 | Full translation, body restoration, exceptional cargo, foreign power compatibility and all relevant effect laws | Core selections establish defaults only. Read the exact additional rules and implement lifecycle ownership before any Strange-world completion claim. |

## V1. Verification and stopping point

Ran the existing library preparation manager to completion; inspected its manifest/verification output and the seven failures. Cross-checked selected original-source locators, GURPS printed/PDF numbering, Ars pinned hashes and the existing FA10 source/report distinction. Checked report links and private-ignore coverage separately in VALIDATION.json. Runtime mappings are read-only source assessments. No tests, build, gameplay, save mutation, installation, commit or playable acceptance was performed.

The bounded report is complete. Implementation, natural native acceptance and director choice remain open. The next decision is whether to authorize O1 recovery or select O2 as a new feature; neither is silently dispatched here.
