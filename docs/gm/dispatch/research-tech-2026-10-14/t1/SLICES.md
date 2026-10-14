# T1 smallest connected slices

2026-10-14. C1–C5 are original proposals extending the owner codes. No slice
is selected, implemented, tested or accepted. A fitting home-world character
is an example, not a compulsory Frontier start or a universal research ladder.
The palette remains `docs/TECHNOLOGY_AND_PROGRESSION.md:523` onward; G1/G4/G5/
G8/G10 retain their own meaning. Research must change a reachable action,
reading or decision without granting machinery, samples or mastery by narration.

## Common proposed state and UI contract

Prefer one optional `expansion.researchNotes = {schema:1,actors:{}}` owner for
new structured questions/evidence, leaving existing K records as received
accounts. This is a proposed name and version, subject to live allocation.
Each row has an authored stable ID/revision and endpoint
`{worldId,instanceId,continuityId}`. Actor IDs and observations remain distinct
from player intention and author truth. Numeric counters use safe integers;
prose is bounded and comes from public qualified definitions. No arbitrary
free-text scientific simulator is promised.

Absence in old saves is inert. Initialize only on the first actual supported
observation/opt-in, with no historical trial, reward, understanding or stock
invented from XP/kill counts. Add explicit field validation to expansion load,
full-envelope import and publication. Present-but-unsupported schemas reject
without replacing the original save. Allocate a compatible engine/game version
with the integrator so older readers cannot silently execute unknown research.
Do not change frozen old jobs, existing exclusive branches, or their meaning.

C1 may ship alone. C2/C3 consume C1-style questions if later selected; C4/C5
can use narrow independent records without requiring an entire question system.
Existing K remains `{stage,value,at,cause,basis?}`; putting arbitrary progress
fields in K would require changing its contract. K also replaces equal-stage
records, so separate retained evidence is necessary
(`src/simulation_effects.js:281`, `src/simulation_contracts.js:249`).

At 1366x768, put a compact **Questions & findings** section in Notebook Here,
inside its existing right-side/workspace home. Keep the local action or craft
consumer visible alongside it. Show a short question title, evidence status,
one current next action and its cost; open the evidence list on demand.
Use the current screen width and deliberate panel scrolling, not a new full
screen tech tree. At least the selected question, cost and action must remain
visible without page scrolling at this viewport. Tab availability must include
the new section: current notebook tabs only become available from recognized
content (`src/adventure_notebook.js:93`, `:117`). Mobile is deferred.
Dimensions and placement are design targets, not measured runtime results.

## C1. Anomaly log → one open question (RQ1, G4)

**Smallest journey.** Two ordinary woodworking `Short hilt` crafts using one Processed rough wood
each produce visibly different native quality values. Record the discrepancy
only after the second actual result differs from the first, not from a hidden
expected value (`src/crafting_recipes.js:555`). The notebook asks
“What changed this result?” It offers review of that attempt and a supported
comparison using the same recipe. Ordinary crafting remains usable. A failure
or poor result suggests a question; it certifies no hidden cause.

**State shape.** First keep `actors.player.baselines[recipeKey] =
{cause,at,outputKey,quality,endpoint}` for the real initial craft; this opens
no question. `recipeKey` includes category/subcategory/recipe ID, since several
native categories share the Short hilt name. On the later discrepancy, under
`actors.player.questions[questionId]`:
`{revision:1,endpoint,subject:{recipeId},status:'open'|'resolved'|'inconclusive',
openedAt,observations:[{cause,at,actionId,outcomeKey,quality,publicText}],
resolutionCause:null|cause}`. Use one stable authored question per selected
recipe/context; a genuinely new sample/context can reopen it. Repeated actions
can contribute new evidence; render/reload of the same committed cause cannot.
The storage policy can compact redundant prose while retaining counts and
consumer-relevant causes. This is save management, not a fixed “once” limit.

**Save/migration impact.** New optional domain plus native craft publication
adapter. Carry no prior observations across old saves. Preserve the native
craft's cost/output/XP even if no anomaly qualifies. Join question insertion
to the craft rollback/write boundary, not a second unsaved callback. The
existing scope is `src/main.js:4136`; actual result processing is `:4212` and
`:4303`. No change to ordinary recipe IDs or quality formulas is needed.

**Consumer and UI.** An open question reveals one recipe-specific comparison
choice and its missing means. Completing two supported contrasting observations
lets the player record “inconclusive” or a locally supported finding. The
finding opens C2's optional prepared trial if selected; C1 alone is useful
through the comparison action and retained evidence. Place the question beside
the Crafting detail, with an Open notes link. Feed only one derived lead from
the saved question; eventFeed itself remains read-only
(`src/event_feed.js:3`, `:87`, `src/crafting_visibility.js:50`).

**Acceptance, specified not run.** Rebuild and fresh-origin desktop craft
through question/comparison; unchanged good craft control; duplicate render/
replayed cause gives no new evidence; failure of storage restores both owners;
old save starts empty; Save/reload and actual Export/literal Import retain open,
inconclusive and resolved states. Compare at 1366x768 with Crafting and notes
visible; keyboard link returns to the same recipe and focus. No hidden output
of a pending job or author explanation appears in labels/search/counts.

## C2. Ordinary action evidence → a prepared trial (RV4, G5)

**Smallest journey.** Successful ordinary `Roasted rat meat` and `Roasted
purified rat meat` crafts supply two distinct evidence kinds for one local
preparation question. These exact native recipes use Rat meat chunks, with
Belmart leaf added in the latter (`src/crafting_recipes.js:1634`, `:1643`).
Their existing rewards remain native. The evidence prepares one optional
comparison trial, shortening its proposed played duration from four to two
minutes. The trial holds and returns one actual meal of each kind, spends one
stamina, requires current cooking-station access and records a comparison of
their already observable effects. It consumes no extra meal and grants no
invented cure. This changes research work, not all cooking speed or XP. Both
routes remain available. These proposed costs and duration need human review.

**State shape.** The selected question adds
`riders:{kindA:{cause,at},kindB:{cause,at}},preparedTrialRevision:1|null`.
A trial job freezes `{questionId,questionRevision,evidenceCauses,duration}`
in its own validated job metadata. A completed trial stores a resolution
receipt in the question and K. Prepared knowledge remains available for later
supported trials; it is not a consumable global Eureka token. Same-kind repeats
can add their observed history without repeatedly stacking the duration bonus.

**Save/migration impact.** Reuse C1's optional domain. Missing fields in a
C1-only save default to no riders; do not infer them from Crafting XP or native
craft counters. Introduce a new command revision for the prepared job and
retain all already pending jobs unchanged. Native craft evidence and the new
note publish atomically. In-flight duration changes require explicit job
migration, so this design avoids changing jobs already accepted.

**Consumer and UI.** The trial owns real costs, sample, effort and current
place/station support. Two evidence kinds change only that job's time quote.
A lack of materials still blocks it. Show “Prepared by [two received results]”
and the current duration beside Start comparison; no separate points bar.
Existing paid observation-to-jig research supplies a working structural example
(`src/audit_remainder_home_content.js:113`, `:119`), while Work Ledger already
consumes ordinary craft evidence (`src/work_ledger_system.js:119`). Implement
at that native publication seam, not by another free-running event watcher.

**Acceptance, specified not run.** Rebuilt fresh-origin acquisition of each
rider through actual ordinary crafts; no/one/two-kind duration controls;
no stock/XP bonus from inspection; repeated crafts have their declared effect;
missing station/sample refuses; cancel returns declared reserved inputs;
unprepared and prepared pending jobs survive Save/reload/Export/literal Import
with exact durations and causes. Storage failure awards neither progress nor
phantom evidence. Desktop shows evidence, current cost and trial button together.

## C3. Folk claim → locally testable method (RF3, G8)

**Smallest journey.** A local worker tells a folk claim about preparing timber.
The player can try the actual folk procedure, the ordinary method, and one
supported comparison. One local rule can make the folk procedure work. The
claim's explanation remains a hypothesis until its discovery route supports
it. Neither local truth nor failure becomes a universal world law.

**Sealed design boundary.** Use rule ID **RF3-TIMBER-S1** and route
**matched timber trials**. This report deliberately contains no hidden causal
truth or mapping of test conditions to the secret answer. A future sealed
content owner defines that mapping; UI records only received claim and
performed outcomes. No sealed file was created or opened by T1.

**State shape.** `questions['folk.timber'] = {revision:1,endpoint,
status:'open',claimCause,hypotheses:{folk:{status:'reported',sourceActorId}},
trials:[{cause,at,methodId,sampleKey,contextRevision,resultKey}],
learnedMethodRevision:null|1}`. The reported claim goes in K at `interpreted`,
not automatically `understood`. Hidden rule data belongs to authored sealed
content, never this player evidence row. No per-player random truth reroll on
opening the notebook.

**Save/migration impact.** C1-shaped optional question. Add revisioned local
trial commands and freeze paid material/context at admission. The method's
actual outcome and note settle with the same cause. An old save has no rumor,
trial or learned procedure. Preserve old drying jobs and both normal routes;
existing finite specialization restrictions do not become new research limits.
Absent content retains dormant evidence and disables its unavailable action.

**Consumer and UI.** A supported successful procedure opens its local repeatable
preparation command with actual materials/effort/time. Learning an explanation
can offer a different supported procedure later; it does not retroactively
create stock or rewrite history. Reuse counted green/compatible offcuts and
actual fixture consumers, not a global superstition/luck stat
(`src/audit_remainder_home_content.js:112`, `:131`,
`src/home_furnishing_content.js:78`). Notebook shows reported/tested/inconclusive
and a comparison choice. Disconfirming a claim preserves its record and other
available methods. Fit the same 1366x768 action-plus-notes placement as C1.

**Acceptance, specified not run.** Rebuilt fresh-origin rumor → real trial →
actual usable output → repeat use; ordinary control and changed-context case;
unperformed/invalid tests add no conclusions; paid failures preserve their
actual loss/evidence policy; cancellation/refund and storage failure remain
atomic. Save/reload/Export/literal Import retain rumor, paid trial, local scope
and command revision without rerolling. Search/tooltips/event feed must pass a
secret-leak review by ID/route, never expose hidden explanations. Human review
owns tone, utility and balance; no forced upkeep follows.

## C4. Encounter evidence → Bestiary research → Rat-step (BS1, G10)

**Smallest journey.** In one actual ordinary wolf-rat encounter, a supported
observation of its displayed movement records a partial field note. Leaving
alive retains witnessed evidence. An eligible victory adds the existing kill
count independently. That observation opens the existing Rat-step study route;
it grants neither technique ownership nor proficiency. Later study/practice
still uses its real existing costs and consumer.

**State shape.** `actors.player.bestiary[enemyDefinitionId] =
{revision:1,endpoint,notes:{movement:{stage:'seen',firstCause,lastCause,count,
publicText}},lastEncounterCause}`. The actual encounter ID/cause is allocated
by the native battle owner. Technique observation uses its existing
`actors.player.techniques` evidence rather than a second learning counter.
The existing victory seam is `src/main.js:3684`, `:3710`; record semantics are
`src/techniques.js:99`, `:168`; the study path is
`src/technique_content.js:13`, `:18`. An observation before victory needs a new
narrow native encounter hook, so this is more than a Bestiary text edit.

**Save/migration impact.** Optional bestiary evidence in researchNotes; native
`enemy_killcount` stays unchanged. Old killcounts retain legacy Bestiary
entries but create no research notes. Do not hide already exposed base stats
or drops without a separate compatibility/product decision. Persist observation
and technique evidence together before announcing them. No new native XP track.
Exclude challenge/person enemies with `add_to_bestiary:false` unless separately
qualified (`src/enemies.js:84`, `src/native_battle_host.js:31`).

**Consumer and UI.** Add a Field notes row and Study observed movement link to
the existing Bestiary entry. New partial notes may be visible without a kill,
but unknown stats/drops remain unexposed; legacy killed entries keep incumbent
information (`src/display.js:5311`). Also show the current note and link in
Notebook Practice after combat. At 1366x768 the link and evidence status are
readable in a persistent detail row, not a hover-only tooltip. This gives a
real learning route without inventing a permanent damage bonus.

**Acceptance, specified not run.** Rebuilt fresh-origin actual encounter,
supported observation, alive retreat, later study/practice and native consumer;
victory control retains one real kill increment; repeated ticks/render/reload
do not duplicate encounter evidence; unsupported sight/body and excluded enemy
supply no note; failed save retains no orphan technique observation. Save,
reload, actual Export/literal Import cover partial and studied states plus old
kill-only compatibility. Desktop verifies the Bestiary link/focus and Practice
return path. Seeing one enemy cannot reveal the monster catalogue.

## C5. One measured property changes words into a number (TM, G1)

**Smallest journey.** An actual inspected notch sample shows a qualitative
width label. Obtain a locally supported measurement instrument or pay its
qualified operator. Complete one numeric-width examination; show the reading,
unit and resolution beside the existing sample-specific fitting/strip action.
Keep an optional words display. Scope is one property of one current sample.

**State shape.** `actors.player.measurements[sampleId] =
{revision:1,endpoint,propertyId:'notch.width',sampleCause,
measurementCause,instrumentKey,operatorId,reading,unit:'local-length',
resolution,at}`. Actual width and calibration belong to the local authored
sample/instrument, not the player's knowledge. The displayed number comes
only from this supported receipt; a placeholder hard-coded number is not
measurement. Public reports do not list undiscovered authored values.

**Code fit and consumer.** Current lens commands qualify sample width/alignment
and offer owned/loan/service access but their receipt text contains no number
(`src/world_completion_lens_content.js:41`, `:53`). A magnifying prism alone
does not establish a calibrated length scale. For this slice, add one `Graduated timber rule` built from one owned
Compatible repair offcut with the existing reusable measuring jig held and
returned, one stamina and three played minutes at the permitted bench.
Its authored local graduations support only the selected notch-width range;
construction grants no sample reading. A separate two-minute examination holds
and returns that rule and spends one stamina. A qualified gauging service or
genuinely capable appraisal faculty can remain alternate means later. A reusable
measuring jig already exists (`src/audit_remainder_home_content.js:119`), but
it needs an explicit supported width-reading function rather than that ability
being assumed. Existing sample/cause and stamped-strip checks supply provenance
(`src/world_completion_materials_facts.js:47`,
`src/world_completion_learning_facts.js:51`).

The numeric receipt enables one new width-matched strip quote using the
existing fitting consumer; use the existing larger-material route as the
ordinary alternative. The new recipe must actually read property/sample/revision
and supported instrument evidence, not just a `hasNumber` UI boolean. An authored
local fit table suffices; no general geometry engine or global stat fog needed.

**Save/migration impact.** Optional measurement rows. Current old measurement
receipts remain valid for their old actions and acquire no fabricated number.
New numeric recipe revision uses only new numeric evidence; do not alter old
accepted jobs or stamped strip keys. Old samples have no numeric reading until
actually examined with supported means. The precise sample identity and unit
are local; cross-world retention keeps provenance without guaranteeing usability.

**UI at 1366x768.** Keep the sample card and material requirement together in
Feature/Notebook Here: words before, number/unit/resolution after, then the
changed fitting action and cost. Toggle words without discarding the receipt.
Stored historical readings are labelled as historical when the sample changes;
current exact eligibility is recalculated. No quantity hidden elsewhere in
native inventory becomes vague as a side effect.

**Acceptance, specified not run.** Rebuild and fresh-origin inspect → acquire/
service → perform measurement → numeric display → real fitted-strip use;
missing gauge and sample-changed controls; current versus historical display;
ordinary unmeasured route; owned/borrowed/service custody and payment negatives.
Cancel/refund and failed publication preserve sample, inventory and coin owners.
Old-save load plus Save/reload and actual Export/literal Import retain values,
units, provenance and pending jobs exactly. Desktop screenshot/keyboard proof
shows the word-to-number change and useful consumer together. Human acceptance
owns fictional units, wording, benefit and pacing.
