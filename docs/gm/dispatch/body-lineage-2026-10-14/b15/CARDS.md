# B15 body cheat cards, 2026-10-14

Proposal catalogue extending G70/G71, not granted cards or implemented hooks.
All 22 JSON blocks use the ten exact keys accepted by
[`validateCheatCard`](../../../../../src/cheat_cards.js:32). Supporting prose
holds the richer placement/library fields without widening the runtime schema.
`state.schema` is a proposed per-card version; C0 does not validate its semantics.
Hooks below are named future adapters, inert under C0. No function or executable
script belongs in a card. `observers` describes the proposed lens; it does not
currently execute an appraisal contest. No new panel IDs are introduced.

## Shared placement, evidence and dials

**P1 Evidence.** Names and promises are STATED proposals from
[G70/G71](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g70-cheats-that-show-bodies).
Source existence is SHOWN by inspection; every new mechanism, world fit,
enemy policy, scope, cost and growth stage below is INFERRED design. No feats,
anti-feats or outliers have been exercised. A later adaptation must qualify its
own source ledger; book references in the owners are inspiration, not proof
that a named character holds these exact cards. Original public variants keep
the same working names with world-specific fiction.

**P2 Local adjectives.** Default: narrow self/one-target scope and useful
information or one real operation, without an obligatory flaw. Dial: silent,
noisy, clean, taxing, licensed, illicit, common, rare, autonomous, patron-bound,
precise, approximate or exceptionless when supported by the selected world.
Reason and cost follow the carrier, operator, input, fuel and target. Reading
existing evidence is free by default; sampling or changing a body can spend
time, stock, energy, money, favors or years. No universal slot ceiling, purity
hierarchy, compulsory contamination, retry penalty or fixed once-only limit.
Terms in JSON select one default variant, not all possibilities.

**P3 Both sides.** Any card can be held by the player, a qualified NPC/rival,
or a supported item/place service. The actual holder owns its state, evidence
and fuel. Being able to diagnose does not supply a way to find, reach, harm or
communicate with the target. NPC readings remain theirs until witnessed or
transmitted; no automatic player mirror. Tells and counters below are proposals
for discoverable means, not guaranteed universal counters. A superior local
authority can defeat a counter if its authored rules say so.

**P4 Sealing.** For every card, its scope and an authored discovery route must
both qualify a sealed reveal. Reports use only secret ID, route and status.
Before discovery, omit truth text and truth-derived names, counts, percentages,
menus, hints, DOM data, accessibility labels, logs and share summaries. A
supported partial clue may appear without its hidden explanation. Effects can
work unnamed. A denied read says only what the observer can know about the
failure; do not imply a hidden faculty exists by reporting a special block.
See [sealing owner](../../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10).

**P5 Carriers and meetings.** Home operation needs the stated means. Outside,
test carriage, activation, sensing, fuel, authority and execution separately
using Works/Reread/Rechannel/Weakened/Blocked. Knowledge retained through an
actual journal/soul/item is dated evidence, not fresh truth. Losing a carrier
stops its active verbs; understood evidence can remain through its own carrier.
Heirs receive actual samples, devices, records or faculties through their
respective succession owners, not by copying the whole card because its holder
died. [Cosmology](../../../../CHEAT_COSMOLOGY.md#the-placement-card) owns these
distinctions. The real Save/Export/Import facility stays outside the fiction.

## CV1 Status window body tab

```json
{"id":"body.cv1","family":"analysis","name":"Status window body tab","ui":"status-window","terms":"gift","hooks":[{"event":"onBodyObservation","adapter":"bodyKnowledgeProjection"}],"state":{"schema":1,"stage":0},"stages":["known summary","dated comparisons","scoped measurements"],"observers":[{"target":"self","channel":"system data","grade":"category"}],"sources":[{"status":"stated","owner":"G70.CV1"}]}
```

**Placement/loop:** system plus retained knowledge; view, compare, check source.
Self-body only, immediate projection of committed evidence. Resources are
observations, not stat points. The system's reach sustains the lens; a retained
report can survive it. Scope has no demonstrated feat yet.

**Means/knowledge:** reads known frame, physique/constitution observations,
qualified bloodline readings and observed conditions. It cannot infer a
concentration from a source's capability amount, anatomy from identity, or a
missing trait from an empty array. Unknown genetic models stay unassigned.

**Discovery/growth:** a committed self-assessment or delivered scoped report
enables Body on an already discovered window. Comparisons and measurements
develop through better means, not opening the tab repeatedly. See
[CV1_SPEC](CV1_SPEC.md) for exact initial route and disabled states.

**Limits/sealing:** date every diagnostic value; preserve conflicting claims,
round only measured units, omit unobserved parts. P4 applies to names and
concentration as well as text. No automatic deep self scan.

**Enemy/rival:** a rival optimizes around their own dated report; a tell is
checking it before work. A changed body or jammed system can make that plan
stale. Reading their window needs a separate means.

**Worlds/cost:** Village = proposed private cheat; system world = ordinary
interface unless extra depth is exceptional; cultivation = carried system
using local bodily vocabulary. HP/D&D/ASL/MOL/TTKS need an imported system or
local instrument analogue; LOTM/Shadow Slave need qualified schemas. Default
free cached view; Dial taxing live scan, noisy display or licensed report.

## CV2 Bloodline eye

```json
{"id":"body.cv2","family":"appraisal","name":"Bloodline eye","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"lineageFacultyReading"}],"state":{"schema":1,"stage":0},"stages":["signal","carrier category","measured expression"],"observers":[{"target":"one visible body","channel":"blood faculty","grade":"presence"}],"sources":[{"status":"stated","owner":"G70.CV2"}]}
```

**Placement/loop:** body-bound eye, inspect and compare one reachable body;
sampled signals are the resource. It reads the local faculty carrier, not all
forms of kinship. Outside: carried eye may work while foreign blood/pact schema
needs Reread or remains Blocked.

**Means/knowledge:** can detect supported line signals, then identify stage or
measure concentration under a declared unit/model. Cannot know upbringing,
loyalty, adoption, original donor or learned family mannerisms from a signal.

**Discovery/growth:** an observed contrast starts the enquiry; authenticated
reference samples and actual eye training distinguish dormant, grafted and
expressed faculties. Losing the eye ends new reads; its notebook persists.

**Limits/sealing:** a graft can look like ancestry; masked signals and unfamiliar
carriers yield scoped inconclusive readings. S-ID ancestry/function reveals
require the authored route, not merely high precision.

**Enemy/rival:** a clan hunter buys reference blood and scans a witnessed target.
Eye flare or a repeated inspection is a tell; a channel-specific mask, changed
sample or broken sight line offers counterplay without hiding everything.

**Worlds/cost:** cultivation = rare lineage faculty; Naruto-style graft contexts
require local sourcing; D&D = pact/species-specific lens; HP pure-blood legal
status is not a measured magical potency. ASL/TTKS/MOL/LOTM/Shadow Slave = only
qualified imported/local variant. Default free shallow sight; Dial fatigue,
reference cost, noticeable gaze or exceptional precise sight.

## CV3 Physician's sight

```json
{"id":"body.cv3","family":"analysis","name":"Physician's sight","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"conditionDiagnosis"}],"state":{"schema":1,"stage":0},"stages":["located symptom","differential reading","carrier diagnosis"],"observers":[{"target":"one patient","channel":"medical sense","grade":"category"}],"sources":[{"status":"stated","owner":"G70.CV3"}]}
```

**Placement/loop:** body faculty or carried diagnostic instrument plus learned
interpretation. Examine, compare, refer; observations and references support
care but supply no healing. Home physiology must be qualified; foreign anatomy
requires calibration or a specialist, not silent universal translation.

**Means/knowledge:** sees injury, supported illness/toxin signal and accumulation
within sensor coverage. LA6 illness/poison can coexist; practice and an actual
assay can discriminate. No culprit, exposure history or cure from symptoms alone.

**Discovery/growth:** an apparent symptom leads to a scoped exam, follow-up and
verified comparisons. New channels add diagnoses rather than generic damage.

**Limits/sealing:** timing, suppressed symptoms, wrong sample and toxins outside
coverage remain visible uncertainties. A medicine route can reveal S-ID only
when authored; a failed sample cannot expose its concealed cause.

**Enemy/rival:** a rival medic targets a genuinely diagnosed weak limb or sells
a report after a real examination. Exam apparatus is a tell; restricted access,
concealed treatment or a channel ward changes their evidence. They still need
harming and communication means.

**Worlds/cost:** Village medical service; HP/D&D magical diagnosis; ASL/MOL
local healer; cultivation pill-residue sight; LOTM/Shadow Slave unusual carrier
specialist. TTKS varies by book. Default patient-access and time; Dial free
exact faculty, clinic fee, fuel, confidentiality contract or noisy scan.

## CV4 Pedigree reader

```json
{"id":"body.cv4","family":"appraisal","name":"Pedigree reader","ui":"appraisal-lens","terms":"lease","hooks":[{"event":"onObserve","adapter":"typedKinshipReading"}],"state":{"schema":1,"stage":0},"stages":["recorded claim","authenticated link","qualified hidden link"],"observers":[{"target":"one family link","channel":"record or kin sense","grade":"category"}],"sources":[{"status":"stated","owner":"G70.CV4"}]}
```

**Placement/loop:** archive service or attuned kin artifact; inspect, authenticate,
challenge, disclose. Default leased access is revocable; an owned original
artifact is a gift variant. Reference coverage and authenticated links are
resources. Foreign kin laws need Reread; archive-only access stays home.

**Means/knowledge:** a declared channel may establish reproductive descent,
ritual kinship or recognized heirship, separately. Cannot collapse adoption,
office, allegiance or similar faces into biological parentage; cannot name
unindexed ancestors from a partial reference bank.

**Discovery/growth:** family claim, independent records, authenticated sample,
then supported link test; deeper coverage comes from research and new references.

**Limits/sealing:** LA12 false resemblance, forged records and unknown prehistory
persist. S-ID hidden-heir reveal requires its exact route; tests report only ID
and status in agent output. Legal recognition is a later action.

**Enemy/rival:** a claimant investigates records, buys access and sends a real
report. Archive enquiries are a tell; forged claims can mislead, restricted
records or a severed channel can stop the enquiry. Evidence is not an estate.

**Worlds/cost:** HP family records, D&D ritual/descent law, ASL registry, MOL
archive, cultivation clan hall; LOTM/Shadow Slave only qualified soul/blood
relation. TTKS chooses its carrier. Default time/access; Dial open archives,
price, favor, dangerous disclosure or exact kin oracle.

## CV5 Potential gauge

```json
{"id":"body.cv5","family":"analysis","name":"Potential gauge","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"methodRelativePotential"}],"state":{"schema":1,"stage":0},"stages":["method grade","bounded estimate","recalibrated forecast"],"observers":[{"target":"one body and method","channel":"test schema","grade":"range"}],"sources":[{"status":"stated","owner":"G70.CV5"}]}
```

**Placement/loop:** test stone/item or system; test, compare methods, recalibrate.
Model coverage is the resource; time horizon and test context bound the estimate.
Outside: Reread when the destination's path/fuel differs, Blocked without a model.

**Means/knowledge:** reports aptitude or a reachable range under a specified
method, body and environment. An exact local fixed ceiling is possible where
lore establishes it. Cannot convert current interest/practice into immutable
talent, infer every future intervention or rate a whole person's worth.

**Discovery/growth:** a grade is tested against real training; calibration and
new method data widen scope. Aptitude change creates a new reading, not a
retroactive rewrite of the old certificate.

**Limits/sealing:** CN8 schema mismatch, LA3 practice and LA10 interest matter.
Hidden potential remains unnamed unless S-ID route qualifies. Do not expose
secret ceilings through sorting or optimal-training hints.

**Enemy/rival:** an examiner recruits or rejects using their own grade; repeated
method-specific tests reveal the gauge. An alternate method, stale certificate
or calibrated second lens offers counterplay.

**Worlds/cost:** cultivation roots, MOL aptitude, ASL scoped aptitude, D&D
path-specific test, tech/system model. HP ancestry is not a potential scalar;
TTKS/LOTM/Shadow Slave need local tests. Default cheap coarse grade; Dial
tuition, scarce reference, biased institution or genuinely exact local law.

## CV6 Breeding forecaster

```json
{"id":"body.cv6","family":"simulator","name":"Breeding forecaster","ui":"simulator-foresight","terms":"gift","hooks":[{"event":"onObserve","adapter":"knownTransmissionForecast"}],"state":{"schema":1,"stage":0},"stages":["broad possibilities","scoped odds","conditional comparison"],"observers":[{"target":"declared contributors","channel":"transmission model","grade":"range"}],"sources":[{"status":"stated","owner":"G70.CV6"}]}
```

**Placement/loop:** system/model plus known parental inputs; forecast, compare,
annotate. Resources are model coverage and reference evidence. Preview never
rolls a child or mutates B7 generation. Outside: carried model is knowledge,
while local transmission may need Reread or new inputs.

**Means/knowledge:** shows conditional odds for a specified trait and creation
method. Unknown carried traits widen or prevent an estimate. Cannot know the
eventual child, their will, temperament, future education or a whole genome.

**Discovery/growth:** first forecast through crop/beast lineage or a qualified
family service; known transmission and verified outcomes improve the model.
Actual offspring freeze contributor inputs at creation under B7, not preview.

**Limits/sealing:** no false exact percentages without known model/inputs;
related-parent forecasts do not disclose S-ID parentage or dormant genes.
Report “insufficient known inputs” without a secret-derived count.

**Enemy/rival:** breeder or dynasty planner acquires the same records and makes
conditional choices. A forecast ledger is a tell; hidden inputs and changed
creation circumstances can defeat a stale plan, not reroll a born child.

**Worlds/cost:** farming/animal breeding in Village, magical species in D&D/HP,
cultivation lineages, biotech labs. ASL/MOL/TTKS/LOTM/Shadow Slave require a
qualified inheritance model. Default free cached forecast; Dial service fee,
sample/time cost or exceptional fate sight. People retain agency; romance
routes use the live adult-age and appearance gate separately.

## CV7 Tell reader

```json
{"id":"body.cv7","family":"appraisal","name":"Tell reader","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"physiologicalCueReading"}],"state":{"schema":1,"stage":0},"stages":["cue","personal baseline","context comparison"],"observers":[{"target":"one present body","channel":"sight sound or touch","grade":"presence"}],"sources":[{"status":"stated","owner":"G70.CV7"}]}
```

**Placement/loop:** trained/body-enhanced senses plus memory; attend, compare,
ask. Immediate local cues, not a persistent omniscient lock. Outside: senses
can travel, species/culture interpretation requires calibration.

**Means/knowledge:** notices pulse, sweat or micro-expression when physically
perceivable. Can compare a known baseline. Cannot turn arousal into a lie,
consent, attraction, intent or a diagnosis without further means.

**Discovery/growth:** witness a cue, ask, learn contextual/person-specific
baselines; broader senses extend range rather than declaring certainty.

**Limits/sealing:** composure, numbness, fatigue and nonhuman anatomy can give
look-alikes. A still face is not “no emotion.” Sealed psychology/body causes
stay unnamed; P4 applies to dialogue options generated from readings.

**Enemy/rival:** an interrogator plans around observed strain; watching the
same cue is a tell. Composure, obscured channels or misleading context can
counter that read; none automatically defeats genuine mind sight.

**Worlds/cost:** fits ordinary HP/D&D/ASL/MOL social life and cultivation,
TTKS, LOTM, Shadow Slave through qualified senses. It is common skill where
ordinary observation suffices, cheat only for exceptional precision/reach.
Default attention and no charge; Dial conspicuous scrutiny, taxing continuous
read or clean perfect sensing of the cue, still distinct from interpretation.

## CV8 Breadcrumb lens

```json
{"id":"body.cv8","family":"appraisal","name":"Breadcrumb lens","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"supportedBodyCueHighlight"}],"state":{"schema":1,"stage":0},"stages":["noticed cue","repeat comparison","cross-channel enquiry"],"observers":[{"target":"reachable cue","channel":"augmented senses","grade":"presence"}],"sources":[{"status":"stated","owner":"G70.CV8"}]}
```

**Placement/loop:** item lens or body faculty; notice, bookmark, compare. Local
perceived tells feed enquiries; not a detector of author-important objects.
Outside: physical channels may Work while local spiritual cues need Rechannel.

**Means/knowledge:** highlights an actually detectable G58 cue. BC1 warmth,
BC4 calluses and BC6 smell support observations, not named constitutions,
profession, guilt or ancestry. False leads have equal presentation treatment.

**Discovery/growth:** notice an ordinary cue, acquire a lens, learn how to
compare; better channels or references open questions. No secret-count radar.

**Limits/sealing:** highlight is chosen from sensed evidence, not hidden truth
or payoff. BC8/BC9 memories need the dreamer's recollection/disclosure route.
S-ID cause remains sealed until qualified enquiry.

**Enemy/rival:** an investigator marks traces and follows with actual tracking
means. Repeated lens use is a tell; wash, cover, lost traces or an innocent
look-alike can interrupt a supported clue chain.

**Worlds/cost:** Village physical clues, HP/D&D enchantment senses, ASL/MOL
trade and medical tells, cultivation affinities; TTKS/LOTM/Shadow Slave
additional channels only if authored. Default free shallow highlighting;
Dial attention, lens maintenance, noisy aura or exact cue enhancement.

## CV9 Compatibility check

```json
{"id":"body.cv9","family":"analysis","name":"Compatibility check","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"scopedBodyFitQuote"}],"state":{"schema":1,"stage":0},"stages":["known requirements","sampled fit","conditional interaction"],"observers":[{"target":"body and proposed input","channel":"analysis model","grade":"range"}],"sources":[{"status":"stated","owner":"G70.CV9"}]}
```

**Placement/loop:** diagnostic item/system plus known requirements; compare,
quote, choose another route. Evidence and model coverage are resources, not
installation capacity. Outside: input, fuel and body law must each translate.

**Means/knowledge:** checks a graft, medicine, technique or supported biological
pairing for the sampled body state. Cannot guarantee unknown interactions,
future changes, execution skill, another person's willingness or relationship.

**Discovery/growth:** learn one requirement, run a genuine scoped assay,
compare outcomes; more channels permit interaction checks. Commit rechecks
actual fit independently of what an earlier preview knew.

**Limits/sealing:** timestamp body/input revisions; expiry invalidates quote,
not history. A hidden rejection mechanism must not appear in the preview's
reason text unless its S-ID route qualifies. Blind attempts remain possible
under an authored procedure with known costs, not invented certainty.

**Enemy/rival:** a rival surgeon selects viable procedures for their own clients.
A calibration rig is a tell; corrupted samples or a changed body can spoil a
stale plan. A poisoned preview never grants an actual successful graft.

**Worlds/cost:** B11 original procedure, cultivation pill/graft, HP/D&D ritual,
tech implant; ASL/MOL medicine, TTKS/LOTM/Shadow Slave qualified carriers.
Default cached comparison free; Dial paid assay, sample use, license, exposure,
or a clean exact means within its supported scope.

## CV10 Lifespan counter

```json
{"id":"body.cv10","family":"divination","name":"Lifespan counter","ui":"appraisal-lens","terms":"gift","hooks":[{"event":"onObserve","adapter":"worldLifespanReading"}],"state":{"schema":1,"stage":0},"stages":["age basis","conditional span","qualified fate count"],"observers":[{"target":"self or one reachable person","channel":"life or fate sense","grade":"range"}],"sources":[{"status":"stated","owner":"G70.CV10"}]}
```

**Placement/loop:** body/soul faculty or patron oracle; read, compare life
payments, choose disclosure. Life reserve and predicted death are separate
targets. Outside: no number without a supported destination life/fate model.

**Means/knowledge:** may measure spendable life-years or a conditional natural
span. Exact death-time sight is a stronger world-authored variant. Neither
chronicle age nor species average establishes remaining years; accidents,
healing and interventions change a forecast unless lore fixes the outcome.

**Discovery/growth:** first scoped life reading; distinguish reserve, age and
forecast through known interventions. Higher grade improves one declared axis.

**Limits/sealing:** reveal basis and uncertainty before frightening certainty.
S-ID cause or fate stays sealed; a count cannot indirectly expose a hidden
death schedule. Changing behavior may invalidate the predicted course.

**Enemy/rival:** a broker purchases real readings to pressure debtors; a ritual
or repeated timed offers is a tell. Privacy, changed circumstances or a fate
ward can counter a channel; knowing time supplies no killing means.

**Worlds/cost:** cultivation life-currency, D&D divination, biotech biological
span, LOTM qualified fate faculty. HP/ASL/MOL/TTKS/Shadow Slave require exact
local qualification or imported lens. Default range, private; Dial life-tax,
oracle fee, publicity or true fixed count where supported.

## CV11 Biased window

```json
{"id":"body.cv11","family":"system","name":"Biased window","ui":"status-window","terms":"loan","hooks":[{"event":"onObserve","adapter":"attributedBodyGrade"}],"state":{"schema":1,"stage":0},"stages":["maker grade","contradiction recorded","bias model understood"],"observers":[{"target":"supported body fields","channel":"maker schema","grade":"category"}],"sources":[{"status":"stated","owner":"G70.CV11"}]}
```

**Placement/loop:** patron/system plus grading policy; read, question, compare
independent evidence. Default revocable service; digested/owned variants exist.
Outside: Reread may preserve its prejudices instead of becoming objective.

**Means/knowledge:** sees what its schema measures and applies maker values.
“Poor fit for this method” is an attributed grade, not low universal worth.
The lens cannot secretly access every true field to manufacture its bias.

**Discovery/growth:** a real outcome contradicts a grade; independent means
and repeated tests expose omissions. Learning bias improves interpretation,
not body power. A corrected system is an optional evolution, not required.

**Limits/sealing:** initial overconfidence can be in-world content, but the UI
attributes the statement to its source. Do not fabricate hidden ground truth
comparisons, correction suggestions or diagnostic error codes. S-ID maker
agenda follows its own route; suspicion is not proof.

**Enemy/rival:** a school examiner sorts entrants by the same bias; repeated
mis-sorting is a tell. Present a method-specific feat, seek another examiner
or exploit a false low grade. Their belief does not alter physical truth.

**Worlds/cost:** cultivation test stone, tech corporation, Paradise service,
HP/D&D institutional certificate; ASL/MOL/TTKS/LOTM/Shadow Slave local rubric.
Default free grade with maker perspective; Dial tuition, license, manipulative
patron, honest narrow scope or optional recalibration cost.

## CV12 Self-only scan

```json
{"id":"body.cv12","family":"analysis","name":"Self-only scan","ui":"status-window","terms":"gift","hooks":[{"event":"onObserve","adapter":"selfBodyScan"}],"state":{"schema":1,"stage":0},"stages":["self signal","located structures","mechanism read"],"observers":[{"target":"attuned self body","channel":"internal scan","grade":"category"}],"sources":[{"status":"stated","owner":"G70.CV12"}]}
```

**Placement/loop:** attuned body/system sensor; scan, locate, compare, plan
self-modification. Samples and internal coverage are resources. Outside: carried
sensor may Work, but a replacement body needs attunement and schema qualification.

**Means/knowledge:** deep structure/process view only for the defined self body.
Does not scan a touched stranger, an heir, a stored sample, or another self
merely because the player controls them. Cannot grant surgical execution.

**Discovery/growth:** awaken a real internal sensor, record a narrow result,
calibrate against known changes; new depth follows supported control/means.
Unlike CV1, an active scan generates an observation through a transaction.

**Limits/sealing:** internal sensation can mislocate a process; unexplained
signal differs from named cause. Even deep exact sensing needs the authored
S-ID route for a secret. Self identity does not bypass sealing.

**Enemy/rival:** a body editor diagnoses themself and patches a known weakness.
Internal scan trance is a possible tell; disturb the real sensor/channel or
change context. The rival gains no diagnosis of the player.

**Worlds/cost:** system-body original, cultivation introspection, tech implanted
sensor; HP/D&D/ASL/MOL/TTKS/LOTM/Shadow Slave only fitted local/imported means.
Default clean self scan, modest time; Dial fuel, sensor upkeep, automatic
feedback, noisy trance or exceptional unlimited scoped sensing.

## CA1 Stat allocation

```json
{"id":"body.ca1","family":"system","name":"Stat allocation","ui":"status-window","terms":"gift","hooks":[{"event":"onAction","adapter":"bodyStatAllocation"}],"state":{"schema":1,"stage":0,"unspent":0},"stages":["earned points","allocation","supported reallocation"],"observers":[{"target":"allocation effects","channel":"performance or system read","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA1"}]}
```

**Placement/loop:** system point ledger plus body effect owner; earn, quote,
allocate. The card's unspent balance is a future resource, not CH1 system points.
Outside: points may travel while stat mapping needs Reread or execution is Blocked.

**Means/knowledge:** a known allocation buys specified capacity. Does not teach
coordination, recipes or techniques; capability sums cannot represent arbitrary
native stats. Show known deltas, not hidden physique explanations.

**Discovery/growth:** first legitimately earned point and visible allocation;
growth adds applicable axes, finer control or an authored respec route. No
retroactive progression-chain completion or grant from catalogue presence.

**Limits/sealing:** inspect/preview spends nothing; commit debits once and
applies one authoritative bonus. S-ID traits are not offered as named hidden
allocation targets; actual effect may be observed through its route.

**Enemy/rival:** a system holder saves points then changes capacity before a
fight. A supported sudden strength change is a tell; counter the new body with
actual means, or exploit their untrained control, not a guaranteed penalty.

**Worlds/cost:** system worlds common unless extra allocation; Village imported
cheat, cultivation conversion only if authored. HP/D&D/ASL/MOL/TTKS/LOTM/Shadow
Slave need a genuine point-to-body mechanism. Default earned points; Dial
refund fee, clean respec, time, patron lien or no-cap god variant.

## CA2 Evolution menu

```json
{"id":"body.ca2","family":"body-growth","name":"Evolution menu","ui":"status-window","terms":"gift","hooks":[{"event":"onAction","adapter":"bodyEvolutionCommit"}],"state":{"schema":1,"stage":0},"stages":["known threshold","chosen form","branch revision route"],"observers":[{"target":"evolved body","channel":"appearance or faculty read","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA2"}]}
```

**Placement/loop:** body transformation source plus system choice; qualify,
preview, evolve, learn movement. Evolution inputs/thresholds are resources;
growth time belongs to the transformation owner. Outside: carriage differs
from whether local energy supports the chosen anatomy.

**Means/knowledge:** menu lists known eligible forms and disclosed costs, not
every secret branch. Capacity and expression are separate from coordination,
social recognition and equipment fit. A form's lore label is not a whole kit.

**Discovery/growth:** a real threshold opens a known form; observing/learning
other forms expands choices. Closed branches can have local reversal/fusion
routes rather than a universal permanent lock.

**Limits/sealing:** unknown S-ID form/requirement omitted; no hidden branch
counts. Transformation settles anatomy, custody, vitals and current work through
the actual owner; dormant faculties stay in their own owner.

**Enemy/rival:** rival beast evolves offscreen with actual inputs/time; shed
skin or witnessed changed form is a tell. Contest their new means, environment
or transformation access, without automatic equal scaling.

**Worlds/cost:** original monster/system route, cultivation beast path; HP/D&D
transformation analogue only with local mechanism. ASL/MOL/TTKS/LOTM/Shadow Slave
require source-qualified form rules. Default known resource/threshold; Dial
clean immediate evolution, branch opportunity cost, appetite or paid reversal.

## CA3 Devour and absorb

```json
{"id":"body.ca3","family":"harvest","name":"Devour and absorb","ui":"harvest-ledger","terms":"digested","hooks":[{"event":"onAction","adapter":"bodyIntakeAndExpression"}],"state":{"schema":1,"stage":0},"stages":["eligible intake","digest","expressed faculty"],"observers":[{"target":"intake or expressed trait","channel":"trace or faculty read","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA3"}]}
```

**Placement/loop:** body digestive faculty plus retained sample; acquire, eat,
digest, express. Actual edible material and qualified conversion fuel matter.
Outside: carried tissue can remain while extraction/conversion needs Rechannel.

**Means/knowledge:** can absorb an eligible physical faculty according to its
mechanism. A meal does not automatically copy learned skill, soul, kinship or
ownership. Can know sampled/observed properties, not all hidden donor faculties.

**Discovery/growth:** a real eligible intake establishes a small function;
practice expands precision, input classes or integration. Digested term means
completed integration survives donor withdrawal, not immunity to third-party seals.

**Limits/sealing:** GD3 capacity, contamination and freshness are local adjectives,
including none. No S-ID trait catalogue from raw tissue; expression may work
unnamed. Intake receipt prevents double food/resource/reward settlement.

**Enemy/rival:** predator hunts a known valuable trait with tracking/reach;
feeding traces are a tell. Deny eligible material, hide the actual signal or
block digestion if that counter exists; donor kin react only through evidence.

**Worlds/cost:** original gene thief, sourced Slime-like inspiration, cultivation
beast faculty. HP/D&D/ASL/MOL/TTKS/LOTM/Shadow Slave need an explicit extraction
route, not genre permission. Default finite intake/fuel; Dial clean unlimited
digestion, local contamination, supply cost or politically costly sourcing.

## CA4 Gene bank

```json
{"id":"body.ca4","family":"storage","name":"Gene bank","ui":"harvest-ledger","terms":"gift","hooks":[{"event":"onAction","adapter":"sampleCustodyAndPreservation"}],"state":{"schema":1,"stage":0},"stages":["deposit","preserved sample","qualified blueprint"],"observers":[{"target":"bank access or withdrawal","channel":"custody evidence","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA4"}]}
```

**Placement/loop:** carried device/space or system vault; deposit, label,
retrieve, study. Samples use the inventory/custody owner; blueprints are
information with provenance. Capacity is a vault property, not a body trait
limit. Outside: preserved stock may travel even if powered access is Blocked.

**Means/knowledge:** storage preserves only its declared materials/state;
labels can be unverified. A blueprint requires an actual read/model; neither
sample nor blueprint grants a faculty, creator's skill or cloned identity.

**Discovery/growth:** store one actual sample; qualify preservation, then
analyse a scoped blueprint. Better preservation/indexing opens verbs.

**Limits/sealing:** freshness and custody recorded; never reroll specimen on
retrieval. S-ID hidden properties remain opaque; loss/theft transfers stock or
access only, not automatic knowledge or ownership rights.

**Enemy/rival:** researcher steals a bank then seeks a reader; inventory gaps,
access logs or cold-container traces are tells. Secure custody, revoke real
access or relocate stored carriers; a mythical unhackable vault is a dial.

**Worlds/cost:** tech cryobank, system inventory, cultivation sample archive;
HP/D&D enchanted storage, ASL imprint-like variant only with declared eligibility;
MOL/TTKS/LOTM/Shadow Slave qualify storage separately. Default device stock/time;
Dial power, preservation service, loss exposure or timeless clean storage.

## CA5 Body editor

```json
{"id":"body.ca5","family":"edit","name":"Body editor","ui":"status-window","terms":"gift","hooks":[{"event":"onAction","adapter":"bodyModificationCommit"}],"state":{"schema":1,"stage":0},"stages":["known small edit","located edit","supported reversal"],"observers":[{"target":"changed structure","channel":"appearance or diagnosis","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA5"}]}
```

**Placement/loop:** system editor, synthetic device or qualified body faculty;
read, design, quote, apply, reassess. Inputs/capacity and procedure belong to
the B11-style modification owner, not arbitrary modifiers in card JSON.
Outside: target anatomy, local fuel and delivery must remain supported.

**Means/knowledge:** edits known structures within actual execution scope.
CV9/CV12 can supply evidence but do not grant tools/delivery. It cannot know
all off-target effects, or change identity/address by changing sex anatomy.

**Discovery/growth:** first scoped read and useful edit; growth adds precision,
delivery types or a real reversal route. Blind original variants are possible
with disclosed uncertainty and world-specific outcomes.

**Limits/sealing:** GD budgets/rejection/reversal are world adjectives, not
mandatory universal taxes. Hidden S-ID structures stay unnamed in menu/quote;
after-effects reveal only observable change. Commit handles jobs and vitals.

**Enemy/rival:** a surgeon/editor adapts their body using a real procedure.
Scars, altered tools or clinic custody are tells. Interrupt the actual delivery,
deny fuel or use a counter suited to the new function.

**Worlds/cost:** biotech original, cultivation sculpting, D&D/HP transformation
variant; ASL/MOL/TTKS/LOTM/Shadow Slave require qualified body-writing means.
Default small edit with time/material; Dial clean reversible edit, capacity
increase, local instability, licensing or service debt.

## CA6 Copy a bloodline

```json
{"id":"body.ca6","family":"copy","name":"Copy a bloodline","ui":"status-window","terms":"gift","hooks":[{"event":"onObserve","adapter":"sampledFacultyCopy"}],"state":{"schema":1,"stage":0},"stages":["observed function","supported copy","stabilized expression"],"observers":[{"target":"copied faculty use","channel":"kin or energy sense","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA6"}]}
```

**Placement/loop:** copy source in body/system; observe/touch, capture, fuel,
express. Data and compatible carrier/fuel are resources. Outside: copy record
can travel while function is Weakened or Blocked by destination rules.

**Means/knowledge:** copies a supported faculty, not reproductive ancestry,
clan office, legal heirship or every donor technique. Contact/observation must
carry the information that the mechanism actually needs.

**Discovery/growth:** copy one witnessed function and learn control; later
stabilize duration, strength or new carrier classes. Weaker/temporary is a
variant, not a ceiling imposed on complete-copy worlds.

**Limits/sealing:** a kin-sensitive original may notice if it has that means;
no automatic broadcast. Copying an unnamed S-ID effect does not identify its
truth or donor history. Body/source/faculty owners avoid double granting.

**Enemy/rival:** copier solicits a demonstration or touch, then applies its
own copy. A repeated borrowed signature is a tell. Show an incomplete/fake
function, withhold contact or use an uncopiable carrier only if local rules fit.

**Worlds/cost:** system copier/cultivation original; source-grounded Naruto-like
graft is a different variant, not proof of touch copying. HP/D&D/ASL/MOL/TTKS/
LOTM/Shadow Slave require local faculty eligibility. Default fuel and practice;
Dial temporary lease, perfect clean copy, contact exposure or donor sensing.

## CA7 Body restore point

```json
{"id":"body.ca7","family":"checkpoint","name":"Body restore point","ui":"anchor-list","terms":"gift","hooks":[{"event":"onAction","adapter":"bodySnapshotAndReturn"}],"state":{"schema":1,"stage":0},"stages":["declared body snapshot","bounded return","retention control"],"observers":[{"target":"return traces","channel":"body or temporal sense","grade":"presence"}],"sources":[{"status":"stated","owner":"G71.CA7"}]}
```

**Placement/loop:** Echo Anchor item plus defined body template; set, review,
return, break. Snapshot fidelity and restoration fuel support the operation.
Outside: carried template is not a supported foreign restoration authority.

**Means/knowledge:** records actual eligible body state at capture, even parts
not diagnosed; public preview shows only known retained/lost categories. Does
not reset the world, refund purchases, resurrect third parties, copy memories
or restore equipment unless its domain explicitly includes them.

**Discovery/growth:** set a real snapshot, return one known condition/function;
later qualified retention settings add control. Snapshot uses its own validated
domain, not the external user save file or lossy life record.

**Limits/sealing:** memory, coordination, material already removed and shared
carriers need explicit composition rules. No sample/resource duplication by
accidental restore. S-ID truth in snapshots stays sealed; invalidation wording
cannot reveal a changed secret.

**Enemy/rival:** rival returns wounded flesh then retains their learned plan.
Repeated restored marks are a tell; capture, anchor separation or a supported
severing counter can work. No automatic “kill again” solution.

**Worlds/cost:** original bounded Echo Anchor; HP/D&D/ASL/MOL/TTKS/LOTM/Shadow
Slave need local restoration/time-domain authority. A MOL-style world reset is
a different mechanism. Default fuel/time; Dial clean repeatable return, charges,
anchored location, temporal traces or different coordination retention.

## CA8 Accelerated growth

```json
{"id":"body.ca8","family":"time-dilation","name":"Accelerated growth","ui":"status-window","terms":"gift","hooks":[{"event":"onAction","adapter":"bodyDevelopmentAdvance"}],"state":{"schema":1,"stage":0},"stages":["qualified growth span","controlled development","local-clock mastery"],"observers":[{"target":"development change","channel":"appearance or records","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA8"}]}
```

**Placement/loop:** chamber/item, body process or patron growth faculty;
prepare, quote interval, grow, adapt. Nutrients/energy and a declared clock
advance support it. Outside: chamber access can stay home while a carried
biological process travels if its fuel/laws permit.

**Means/knowledge:** knows stated developmental interval and measured changes,
not every latent awakening or eventual lifespan. Maturity does not grant
education, movement practice, calendar age, adult appearance or relationships.

**Discovery/growth:** a supported plant/beast or own-body span demonstrates
growth; better regulation directs structure and safe timing. No forced child
start, puberty gate or compulsory body decline.

**Limits/sealing:** lifespan/appetite/stability costs are local, including none.
Do not advance every world's clock or replay yearly NPC events. S-ID delayed
effects publish only qualified observations; retained timers belong to their
clock owners. Romantic eligibility uses live body-age/appearance rules.

**Enemy/rival:** breeder or body-temperer uses real growth stock/time, with
outgrown gear or changed records as tells. Interrupt supplied fuel/chamber,
challenge unfamiliar coordination, or change the schedule where supported.

**Worlds/cost:** biotech incubator, cultivation growth method, HP/D&D ritual;
ASL/MOL/TTKS/LOTM/Shadow Slave require a sourced growth/clock mechanism.
Default finite input and developmental span; Dial clean acceleration, extra
nutrition, spent years, instability or a reversible age process.

## CA9 Breeding authority

```json
{"id":"body.ca9","family":"inheritance","name":"Breeding authority","ui":"status-window","terms":"gift","hooks":[{"event":"onAction","adapter":"qualifiedTransmissionChoice"}],"state":{"schema":1,"stage":0},"stages":["known trait choice","supported transmission","expanded carriers"],"observers":[{"target":"creation process or expressed heir trait","channel":"record or diagnosis","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA9"}]}
```

**Placement/loop:** system/ritual authority at a supported offspring creation;
select, quote, commit, teach. Actual transmitted carrier and creation access
are resources. Outside: stored choice does not override destination heredity
without authority; prior born child's frozen inputs remain unchanged.

**Means/knowledge:** controls the traits its inheritance mechanism supports,
not a child's allegiance, identity, consent, learned skill or later decisions.
Birth faculty, adoption, school legacy and office stay distinct.

**Discovery/growth:** qualified plant/beast/lineage transmission reveals one
choice; verified outcomes and actual authority extend trait classes. CV6 can
forecast, but prediction does not grant the power to choose.

**Limits/sealing:** GD1 and SC3 local consequences remain. Unknown S-ID traits
are absent from selection labels; a random/opaque carried variant can function
without telling the player its truth. No preview rolls or retroactive heir edits.

**Enemy/rival:** dynasty planner uses actual contributors and authority;
repeated selected expression or an authenticated procedure is a tell. Break
actual access or offer heirs another path; changing loyalty is not gene removal.

**Worlds/cost:** biotech designer lineage/cultivation original; HP/D&D/ASL/MOL/
TTKS/LOTM/Shadow Slave need specific heredity or pact authority. Default actual
creation resources; Dial precision fee, patron covenant, clean inheritance,
institutional obligations or zero extra trait-selection cost.

## CA10 System body shop

```json
{"id":"body.ca10","family":"system-shop","name":"System body shop","ui":"system-shop","terms":"lease","hooks":[{"event":"onAction","adapter":"bodyOfferPurchaseAndDelivery"}],"state":{"schema":1,"stage":0},"stages":["known offer","qualified delivery","negotiated catalogue"],"observers":[{"target":"purchase or installation","channel":"market records or diagnosis","grade":"category"}],"sources":[{"status":"stated","owner":"G71.CA10"}]}
```

**Placement/loop:** system vendor or patron with stock, delivery and terms;
inspect, negotiate, buy, install, settle debt. Shop access is the default
lease; each purchased faculty has separately authored gift/loan/lien terms.
Currency, stock and delivery means remain real, not generated by opening UI.

**Means/knowledge:** lists known offers, attributed claims, disclosed price,
delivery and compatibility uncertainty. Buying an organ does not install it,
understand it, know all hidden defects or authorize the shop to edit the body.

**Discovery/growth:** meet/research an actual vendor, complete one useful
delivery, then earn new catalogue access or negotiate terms. Strong instant
delivery is a supported vendor variant, not every shop's baseline.

**Limits/sealing:** hidden motives/fake stock can be content with provenance.
S-ID products and defects stay unnamed until their route; no secret-dependent
discount/sort recommendation. Purchase and installation have distinct receipts;
borrowed access loss does not revoke a digested gift by default.

**Enemy/rival:** corporate recruiter buys upgrades or holds a client's lien.
Invoices, delivery trace or installed signature are tells. Deny actual supply,
contest contract, change vendor or cut revocable access within its terms.

**Worlds/cost:** Paradise/tech clinic/system hub; cultivation auction analogue;
HP/D&D/ASL/MOL/TTKS/LOTM/Shadow Slave need actual vendor and body delivery rules.
Default priced stock/access; Dial favors, years, service debt, bound purchases,
free patron gift or predatory lender. The system's agenda is discovered, not
assumed from the word shop.
