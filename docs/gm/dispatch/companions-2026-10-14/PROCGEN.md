# C5: procedural companions and species

## CHECKPOINT

2026-10-14. COMPLETE, docs-only lane. Owned files: `PROCGEN.md` and
`C5_REPORT.md` in this directory. Source and sibling proposals inspected; no
runtime edits, tests, build, browser run, saves, private packs, commit or push.
Resume from the evidence table and open decisions in the report. All new shapes,
dials and checks below are **INFERRED considerations**, not selected schemas or
implementation requirements. No companion generator is claimed live here.

Authority: [COMMON](COMMON.md), [USER_VISION](../../../USER_VISION.md),
[PROJECT](../../../../PROJECT.md), and the root
[companion palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md).
Keep the first milestone to one realm and one prestige layer. Canon-first world
order stays intact; a synthetic original example is a design illustration, not a
new world priority. Playing AS a companion belongs to
[nonhuman mechanics](../../../worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md)
and [nonhuman bonds](../../../worlds/NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md).
No UI changes in C5; any later playable slice targets laptop/desktop first, with
mobile deferred.

Evidence vocabulary: **SHOWN** means inspected local text/source, **STATED**
means an attributed report or source claim not rerun here, **INFERRED** means a
proposal, **MEMORY** means unchecked recall. There are no MEMORY canon claims
or new external research claims in this lane. Line numbers are this inspection's
snapshot and may move during concurrent work.

## F. Reuse and current limits

| Code | Evidence and locator | Consequence for companions |
|---|---|---|
| F1 | SHOWN: main `src/npc_lives.js:5-22` uses fixed Village names/families and hashed death years | This is not a general person or animal generator. Preserve authored identities. |
| F2 | SHOWN: P4 worktree `.claude/worktrees/proc-p4-people/src/generated_people.js:12-27` saves ID, name/culture, template/role, 2-3 traits, known traits, need, supply goal, possessions, arrival/status and relationship; lines 29-41 validate schema 1 | Reuse these concepts. Its three-traveler, Village-only validator cannot admit arbitrary companions or species. |
| F3 | SHOWN: P4 `generated_people.js:43-79` has pure hourly projection, discovered-trait views and meet/talk/help/settle | Useful separation of truth, observation and changed state. It is not recruitment, animal training, combat, breeding or a full history model. |
| F4 | SHOWN: P4 `.claude/worktrees/proc-p4-people/src/name_grammar.js:4-21` supplies hill/river/road pools, saved culture/revision, authored-name reservations and explicit exhaustion | Reuse qualified culture pools; animal nicknames and nonhuman naming need distinct conventions. Flat given×family enumeration weights larger cultures more heavily. |
| F5 | STATED: [P4 branch report](../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md) reports test/build and natural save/import proof; native hourly transitions and arrival/departure cycles remain open | C5 inspected code, did not rerun those checks. The [status](../procgen-2026-10-13/STATUS.md) and story root describe separate-branch work, not merged current gameplay. |
| F6 | SHOWN: `src/main.js:440` initializes random expansion state; `src/expansion_engine.js:73-75,518-521` stores and advances `rng`; `src/main.js:5190,5308` saves/restores expansion | A saved cursor exists. `expansion.rng` is mutable, not an immutable root suitable for ad hoc identity generation on every render. |
| F7 | SHOWN: `src/simulation.js:36-38,49,67` derives event cursors and clones plans; `src/simulation_resolution.js:4-6,15-23` derives stable seeds and freezes spawned templates | Reuse seed derivation and frozen identity seams, with explicit companion admission and durable ownership. Derivation alone is not persistence. |
| F8 | SHOWN: P1 worktree `.claude/worktrees/proc-p1-streams/src/seeded_streams.js:23-40,46-71` holds root/cells/log, validates restore, offers pure decisions and consuming ordinals; lines 3-12 constrain stream families | Named stream support is branch-local evidence. Proposed companion stream names need reviewed registration; no guessed live API. `keyedUnit` records a receipt, so it is not a mutation-free preview. |
| F9 | SHOWN: `src/expansion_persistence.js:5-16,30-50` copies the full envelope, stages owners, validates then writes storage before caller publication | Candidate seam for atomic companion, resources and draw publication; a new owner still needs validation and integration. |
| F10 | SHOWN: [P19 companions G2.1](../procgen-2026-10-13/p19/COMPANIONS.md) distinguishes a keepsake from a saved past; [P11 N3/N4](../procgen-2026-10-13/p11/ECOLOGY_AND_COMPANIONS.md) separates ecology, temperament, learned behavior and observed knowledge | Extend those proposals instead of creating competing story, ecology or relationship stores. |

The [status map](../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md) is a dated
survey; [story considerations](../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)
records later branch work. Keep both readings: existing main RNG picks authored
outcomes, while inspected P4 branch source generates bounded traveler records.
Neither establishes a live procedural companion/species system in this checkout.

## I. Individuals with recognizable behavior

INFERRED: reuse a person-shaped identity spine, plus species/body and companion
adapters. Keep baseline temperament, learned behavior, temporary condition and
observer knowledge separate. A frightened response need not change a calm animal
into a permanently fearful one. Traits matter through supported actions, not only
through labels.

| Code | Palette | Default + Dial + Reasonably |
|---|---|---|
| I1 | Temperament: exploratory, cautious, patient, sociable, territorial; context-specific intensities | Default: a coherent species/template package. Dial: independent-minded, gentle, wary, bold or unusual. Reasonably: cautious companions can excel at watch or retreat; no universal best personality. |
| I2 | Quirks: carries a twig, circles before sleep, taps the same bowl, dislikes a certain saddle | Default: a small salient habit. Dial: quiet texture through useful routine. Reasonably: a quirk can be decorative; only a supported consumer grants a mechanical effect. |
| I3 | Likes/fears: food textures, play, proximity, noises, places, known people | Default: species-compatible preferences with optional history cause. Dial: mild avoidance through strong learned fear. Reasonably: distinguish unfamiliarity, aversion and trauma; food liking does not imply dietary safety. |
| I4 | Appearance: body plan, size by life stage, markings, coat/scale/feather palette, scars | Default: coherent visible parts under species constraints. Dial: local variants, unusual specimens, authored forms. Reasonably: markings may be cosmetic; wings, breathing organs or magical faculties need actual means. |
| I5 | Names and aliases per culture | Default: local naming convention and saved result. Dial: keeper nickname, birth name, herd designation, title, self-chosen name. Reasonably: use stable IDs; repeated pet names are plausible, while unique canon identities stay reserved. |
| I6 | Past before meeting | Default: a modest consistent episode, such as a prior keeper or familiar route. Dial: unknown/orphaned history through a linked personal thread. Reasonably: unknown is valid; invented background is marked generated, not falsely recorded as a played event. |
| I7 | Voice when communication supports it | Default: a stable register derived from culture, temperament and learned experience. Dial: gestures, signals, translated impressions, speech or telepathy. Reasonably: speaking does not grant new memories or omniscience, and a translator's interpretation is attributed. |
| I8 | Growth from shared life | Default: preserve baseline, add actual training and remembered experiences. Dial: attachment, independence, habit change, altered identity. Reasonably: trust, obedience, competence and personhood are different axes. |

Proposed conceptual record, reusing owner references rather than storing a second
inventory or relationship ledger:

```text
CompanionIndividual
  id, worldInstanceRef, speciesRef, bodyRef, identityOrigin, admissionCauseRef
  nameRecord {display, cultureRef, conventionRef, aliases, grammarRevision}
  templateRef, temperament, quirks, preferences, appearance
  pastHookRefs, beliefRefs, knowledgeByObserverRefs
  needsRef, goalRefs, learnedBehaviorRefs, bondRefs, custodyRefs, meansRefs
  communicationRef, voiceProfileRef, lifecycleRef, generationReceiptRef
  generatorRevision, contentRevision, sourceSnapshotRef, retainedLawRef
```

This is not a drop-in P4 schema. P4's supply goal, purse, Village residence and
`traveler_[1-3]` IDs remain valid for its own legacy records. Promote a person to a
simulation actor only through an explicit saved ID bridge when a consumer needs
one; party membership alone does not make it a fighter.

| Code | Animals need different fields or interpretation | Contrast with the P4 slice |
|---|---|---|
| IA1 | Diet/foraging, species-specific needs and safe food; satiation only where selected | A bread supply request and human rest/belonging/purpose pools are not generic animal nutrition. |
| IA2 | Pack/herd/nest/territory ties and keeper/custody facts | Village residence and one helped relationship do not model an animal's social organization or ownership. |
| IA3 | Sensory channels, signals, locomotion, manipulation and learned cues | Human dialogue and browsing/planning actions need body-compatible alternatives. |
| IA4 | Instinct, temperament, conditioned response and learned skill | Do not anthropomorphize every avoidance as a moral belief; near-person/full-person cases may use richer person fields. |
| IA5 | Life stages, reproductive mode, molt/season, health and body-specific appearance | Human ages, families and attire are not suitable defaults; constructs/spirits may have no diet or biological breeding. |
| IA6 | Human-given versus self/kin names and observed history | A pet need not have a family name or know its birthplace; keeper testimony is a belief source, not automatic truth. |

INFERRED history join: use [P19 PastHook](../procgen-2026-10-13/p19/COMPANIONS.md)
with stable episode/participant/place/time refs. A previous keeper needs a real
reserved identity or explicitly anonymous role; a scar needs a compatible body
and episode. A lost littermate is not rerolled whenever searched for. Animal
memory can preserve recognition or learned response without preserving a human
verbal account. A newly speaking familiar might describe an old smell or place;
it cannot suddenly identify the culprit it never perceived.

## S. Species, ecology and each world's lore

INFERRED: generate within a world-qualified species family. Pin source version,
continuity, era, habitat and permitted fill before sampling. An authored species
can lock its whole definition or selected fields; individual variation stays
inside those locks. Generated local fill has separate provenance from canon.
Later source corrections need a reviewed compatibility choice, not silent edits
to existing creatures. No franchise-specific ecology is asserted by this table.

| Code | Species/ecology field | Default + Dial + Reasonably |
|---|---|---|
| S1 | Diet, water/fuel, digestion and resource niche | Default: a compatible trophic or magical-resource role. Dial: herbivore, predator, omnivore, symbiont, construct fuel or spirit sustenance. Reasonably: local supplies must support the proposed habitat; null/unneeded is distinct from unknown. |
| S2 | Habitat, range, shelter, season, population relations | Default: fit authored geography and available resources. Dial: homebody through migratory/exotic. Reasonably: a declared distribution is not proof of a simulated food web; P8 owns renewal/depletion. |
| S3 | Life span and stages | Default: world/species/era law. Dial: short-lived, long-lived, ageless, cultivation-altered. Reasonably: age affects body and opportunities through actual consumers; birth/aging/offline policy remain separate. |
| S4 | Mind level, root O1 | Default: species/world determines animal, clever animal, near-person or full person. Dial: permitted individual variation or earned transition. Reasonably: no human obedience model imposed on a full person; speech and personhood are distinct. |
| S5 | What it gives, root W2 | Default: supported materials and collection routes. Dial: shed feathers/scales, silk, milk, venom, salvage or organs. Reasonably: harvesting, harm, consent/custody and local law are separate facts; a tissue does not inherit every combat power. |
| S6 | How companionship is reached | Default: matching temperament and species means. Dial: habituation, food/play, training, raising, rescue, bargain, pact, construction, recruitment or coercion under local mechanics. Reasonably: taming changes specific tolerance/behavior; person-level alliance need not be taming. |
| S7 | Local customs and names | Default: era/culture-qualified attitudes. Dial: household pet, work animal, sacred messenger, protected wildlife, equal citizen. Reasonably: price, access, greeting, housing and collection rights read actual institutions; no universal moral verdict. |
| S8 | Authored locks and generation freedom | Default: canon species/rules pinned, permitted local individuals generated. Dial: authored-only, narrow regional fill, AU variants, original ecology. Reasonably: exceptions need their own source/original law and acquisition path. |

For W2, join [P8 creature resources](../procgen-2026-10-13/p8/CREATURE_RESOURCES.md)
and the [materials audit](../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md).
Collection records producer ID, life stage, body part/source, cycle or portion,
quantity, procedure and material profile revision. Separate naturally shed,
secreted, deliberately extracted and killed-source batches. Reserve against the
actual source; combat loot and carcass processing cannot pay for the same portion
twice. Yield/quality can vary by permitted condition and method, while true
properties remain effective before identification. Reload preserves the product
and its provenance. Species fields alone cannot bypass native item reconstruction
or the materials audit's generated-effect save hazards.

Original illustrative chain: an authored wetland family permits reed-eating,
bank-nesting variants with waterproof coats. Regional generation chooses markings
and nest habit, then an individual's history explains avoidance of bells. Its
shed coat fiber feeds a compatible textile process only if that material rule
exists. A fire gland would require a distinct permitted lineage and ecology,
not an unrelated bonus randomly attached to the wetland animal.

## G. Evolution and breeding as anchored graphs

INFERRED: keep a species/form transition graph, a reproduction compatibility graph
and the individuals' pedigree distinct. A family tree is not the evolution menu.
Existing body/genetics owners retain physical inheritance and transformation
rules; C5 supplies generation considerations, not another progression formula.

| Code | Graph consideration | Default + Dial + Reasonably |
|---|---|---|
| G1 | Authored anchors | Default: pinned starting form, sourced end forms and required laws. Dial: narrow connecting branches through original families. Reasonably: generate compatible gaps; no random canon unique creature or exclusive office. |
| G2 | Typed transition edges | Default: stage growth separated from evolution. Dial: maturation, metamorphosis, training, ritual, cultivation, contract, surgery or fusion. Reasonably: each edge has prerequisites, means, time, cost, result/body changes and retained identity policy. |
| G3 | Useful branches | Default: new verbs or changed preparations, not only higher numbers. Dial: watch, track, carry, shelter, speak, craft aid or travel specialties. Reasonably: a lateral or non-evolving companion remains useful; avoid a single optimal chain. |
| G4 | Breeding compatibility | Default: permitted species, stage, body and world reproduction law. Dial: sexual, asexual, engineered, magical or absent. Reasonably: multi-parent rules use explicit participant sets; cross-species compatibility is not automatic. |
| G5 | Offspring inheritance | Default: correlated lineage/body traits with bounded permitted variation. Dial: recognizable strains, mutations, recessive expression, deliberate selection. Reasonably: learned loyalty, trained skills, speech vocabulary and debts are not genes unless an explicit world law says so. |
| G6 | Cycles and reachability | Default: growth/evolution progression can be acyclic; reversible transformation gets typed edges. Dial: reversion, branching, convergent forms. Reasonably: pedigree ancestry cannot cycle; form cycles need supported cost/time/identity semantics rather than blanket rejection. |
| G7 | Discovery and records | Default: show observed forms and learned routes. Dial: speculation, research, breeder charts, lore revelations. Reasonably: raw graph validation is not discovery; hidden anchors/conditions stay outside public dumps. |

Illustrative form graph: authored juvenile → local adult; generated lateral edges
lead to marsh tracker or load carrier, each constrained by body and actual
training/means. A later authored spirit form may be connected only if the chosen
world allows that transition. Breeding compatible adults creates a new individual
with parent refs; it does not turn a parent into its offspring. A convergent form
can have several routes without implying mixed parentage.

Generate a valid subgraph at a declared world/lineage admission boundary, or lazily
at a stable retained key under a frozen revision. Validate reachable prerequisites,
resource availability or declared acquisition routes, body/mind compatibility,
anchor locks and meaningful branch consumers. Store selected edges and resolved
forms with revision and cause. If there is no valid candidate, retain authored
options or report unavailable generation; avoid arbitrary retries that consume
unrelated draws. Graph revelation must not create previously nonexistent biology.

## D. Determinism, persistence and save impact

INFERRED: seed + saved resolved record + saved revision + saved allocation state
are needed together. A seed by itself cannot preserve output after tables change.
The P1 stream-family allowlist and final integrated interface need review before
naming new stream families.

| Code | Lifecycle or save case | Proposed treatment |
|---|---|---|
| D1 | First admission | Bind world instance, species/lineage, revision and unique cause; allocate on a detached plan; derive individual field keys from that allocation. Validate the whole candidate, then persist all changed owners together. Repeated cause returns the same identity. |
| D2 | Preview, rendering, sorting and restore | No identity, graph, history or voice draws. Project known data. Shop/combat/cosmetic draws must not shift a companion allocation; stable field subkeys avoid appearance draws shifting temperament. |
| D3 | Naming collision/exhaustion | Deterministic candidate traversal from a saved reservation snapshot. Disambiguation does not change identity. Preserve already saved spellings; an exhausted pool exposes a declared fallback or unavailable result, not an endless retry. |
| D4 | Training, evolution, taming and birth | Each real new cause can change state and commit its own variation. Persist outcome, costs, body/knowledge changes and draw receipt atomically. Failed/cancelled persistence publishes neither resources nor cursor changes. Repeated action is new play, reload is not. |
| D5 | Existing generated companion | Restore resolved baseline, body, history, learned behavior, voice, relationships, materials and graph references. Updates do not reroll or silently rename it. Preserve its supported retained law revision, or perform an explicit tested migration. |
| D6 | Old save without companion owner | Absent stays absent; no retroactive adoption, births, lost inventory or changed households. Explicit future admission uses the current supported game clock. Existing authored pets/flags need an idempotent bridge tied to their original cause, not a second reward. |
| D7 | Missing pack/future schema | Preserve safely with disabled dependent actions if a supported inactive reader exists, otherwise reject before mutation. Never substitute a fresh creature, Village culture or empty owner. |
| D8 | Time and absence | Use selected played-time/world-clock policy. Reconcile legal due boundaries; no implied wall-clock aging, hunger death or surprise loss. Split/jump/reload equivalence depends on the same declared policy and supported actions. |

Proposed save footprint: optional owner header with schema/revisions/allocation
state; shared saved species/form definitions keyed by ID; individual resolved
records; parent/anchor refs; queued commitments and cause receipts; observer
knowledge/learned-route refs; retained material/source records. Keep canonical
relationships, bodies, inventories and story threads in their chosen owners.
Deduplicate shared definitions without depending solely on an installed current
catalogue. Archive departed/dead individuals as compact summaries with pinned
ancestry, custody, open promises and material provenance, rather than deleting
references. Memory/detail promotion preserves previous facts.

Measure UTF-8 export bytes and browser storage bytes separately using the existing
`src/save_files.js:197-216` size/guard seam. Sample one companion, a herd and several
generations; report individual/graph/history contributions and import time.
Numeric budgets are open design choices, not measured C5 results. Compact
repetition windows and resolved closed history, but retain receipts still read by
open arcs, offspring, materials or discovery. Import validates the full reference
graph and clock before durable mutation; saving just `seed` and `speciesId` is
insufficient.

## Q. Avoiding samey pets, with a headless check idea

SHOWN: [LIFE_SIM_NORTH_STAR P8](../../../LIFE_SIM_NORTH_STAR.md) at lines
7100-7103 warns that repetition kills these stories and that a body's verbs need
to change as it grows. This is an authored design observation, not a measured
pet-generator result. More coat colors or synonyms do not resolve that problem.

| Code | Quality consideration | Default + Dial + Reasonably |
|---|---|---|
| Q1 | Coherent packages plus room for exceptions | Default: correlated species/temperament/need/past choices. Dial: unusual individuals with an explained cause. Reasonably: prevent contradictory combinations without collapsing everyone to one template. |
| Q2 | Behavior distinguishes individuals | Default: at least one meaningful preference changes a supported response. Dial: texture through richer teamwork. Reasonably: differences need context, so curiosity is useful in searching while patience helps waiting. |
| Q3 | Growth changes verbs | Default: stage/learning unlocks a new useful action or changes how an existing action works. Dial: new senses, carrying, communication, mentoring or an altered route. Reasonably: a pet that stays small can develop skills/history rather than compulsory evolution. |
| Q4 | Recurring attachment and callbacks | Default: reuse the same companion and actual shared memories. Dial: quiet domestic routines through personal arcs. Reasonably: repetition of a loved cast is not a defect; repeated scenes with identical choices and outcomes may be. |
| Q5 | Novelty memory and quiet | Default: saved recent semantic beat/response families, separate from phrasing. Dial: quiet, cozy, chatty, adventurous. Reasonably: weight eligible alternatives, allow silence when there are none, and keep meaningful routines possible. |

INFERRED headless idea, extending [P18 harness](../procgen-2026-10-13/p18/HARNESS.md)
and [metrics](../procgen-2026-10-13/p18/METRICS.md), not a script run in C5:

| Code | Synthetic check | What it can establish |
|---|---|---|
| H1 | Fixed seed manifest × world profiles × stages; record source/content digests and legal action policies; compare continuous, split-time and serialized/restored runs | Equal resolved identity, hidden baseline, graph, knowledge, commitments and next draw. Include cross-system draw independence, preview purity and failed-write cases. |
| H2 | Generate cohorts and anchored graphs; validate diet/habitat/body/mind rules, names/reservations, chronology, pedigree, source locks, material portions and dangling refs | Structural contradictions and duplicate identity/reward cases. No validation report should export hidden values or discovery mappings. |
| H3 | Paired standardized contexts: watch, search, noisy travel, rest, permitted training and stage transition | Compare semantic response signatures `(context, selected verb, supported outcome class, learned change)`, excluding name/color/text/RNG. Report behavior collision share among eligible peers and stage-to-stage verb-set changes. |
| H4 | Longer legal played-time simulation with recurring companions | Measure beat-family and combined scene repetition in windows 5/20, near-identical text, meaningful callbacks, quiet reasons, available alternatives, decision burden and useful noncombat routes per played hour. Drain scheduler remaining time; no direct clock jump. |
| H5 | Old envelopes, existing P4 records, existing authored pet flags, updated catalogue, missing pack and several generations | Exact preservation or explicit rejection, no reroll/duplicate adoption, saved reference completeness, byte growth and bounded execution. Use generated fixtures, not user saves. |

Record distributions by species/world/mind/stage, rather than rewarding maximum
novelty or treating a calm quiet pet as failure. Initial thresholds need a baseline
and Weibao's play feedback. Add a negative-control catalogue containing renamed
copies: the semantic metric should detect sameness despite apparent name variety.
A positive fixture where a formerly non-speaking companion learns a supported
communication route should change its available verbs while keeping its identity
and past. All H1-H5 are OPEN future checks.

Headless checks cannot prove warmth, believable voice, attachment or readable
presentation. A future selected slice still needs a fresh rebuilt desktop browser
journey with a useful companion action and Save/reload/Export/literal-file Import,
followed by separate fiction/balance acceptance. C5's completion is documentation
completion only.
