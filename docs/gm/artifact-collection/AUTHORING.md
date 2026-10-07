# Physical collections and carried-item scenes

`src/artifact_collection.js` compiles declarative JSON into the existing
simulation commands. Worlds can choose two, six or any authored number of named
pieces. This compiler is reusable infrastructure, not a universal cosmology or
an independent artifact save subsystem.

## Entry points

`compileArtifactCollection({id,revision,worldId,actorId,group,location,requires,
visibleWhen,pieces,recipes,uses})` returns `entries` and normal `commands`.
Each piece names a stable local `id`, canonical physical `key` and `label`.
Each recipe has its own distinct output key, counted `parts` referring to piece
or earlier recipe IDs, and authored `assembly`/optional `disassembly` actions.
Recipe IDs and keys are distinct, and ingredient references must form an acyclic
graph. Partial assemblies are actual items, not a collection counter.

Recipes conserve physical ingredients: assembly consumes the exact declared
counts and creates one output; disassembly consumes that variant and returns
only those counts. Recipe stock cannot be hidden in extra costs/effects/random
outcomes. Additional time/vital/resource costs and knowledge may be authored.
Avoid renewable assembly XP/reward loops in content.

Each `uses` row names its `carrier` entry plus authored costs, effects, duration
and predicates. The emitted command reserves one actual owned unequipped
carrier, executes its paid function and returns the same physical key once.
It cannot duplicate that carrier in effects/outcomes. Existing custody,
equipment, actor reservations, frozen work and durable publication are reused.
Cancellation is refundable; there is no borrowed/equipped apparatus policy in
this first authoring route. Future such uses need their own explicit adapter.
Hosts must also bind `artifactEquipmentReasons(costs,state,context)` for quotes
and commits. Native slots live in fresh `context.equipment`, while simulation
actors use their own stored slots. Missing native equipment snapshots reject
input reservations. The supplied host checks normal work and paid scene inputs;
other world hosts must bind the same helper before publication.
Remembered inspection facts remain usable knowledge; they supply no missing
apparatus, source, mastery or fuel. A use may additionally require its world's
actual source/energy/technique predicates and supported paid effects.

`compileItemEncounter({revision,worldId,group,location,requires,visibleWhen,
command,encounter,items})` adds exact carried-item gates to one declared scene.
Entry has no costs/effects/timer: the existing scene session reserves its actual
participants and owns paid responses/withdrawal. Responses recheck carried
gate items, actor world/location and declared target life/world/contact. The
gate does not consume, duplicate or silently grant the item. Normal encounter
validation and finite stock/claims prevent replayed rewards.

`itemPossessionRule(key,count,reason)` builds a standard inventory predicate.
`artifactCollectionView(compiled,inventoryCounts)` is a read-only actual bag
projection; it never scans undiscovered third-party stocks or awards progress.

## Host integration and compatibility

Compiled commands carry `reservationReturns:1`; the shared executor must admit
that validated explicit marker and copy it into its existing simulation4
frozen-job return field. Other world/group authors need no group whitelist.
It prevents returned apparatus/parts/refunds from being counted as new loot.
Item templates and returned commands are registered by their actual current
world/native/content owners. The sole existing publisher stages native bag,
stock and expansion state together. See INTEGRATION.md for the concrete joins.

Vela's proof uses only existing actor facts/knowledge/completions, optional
simulation people/owners/situations and frozen jobs/scenes. No top-level save
schema or native domain changes. Old saves stay inert until explicit use. New
conserved work uses the already supported simulation4 job marker; earlier
accepted jobs retain their recorded semantics. All save/reload/import/failure
checks remain deferred in ACCEPTANCE_BACKLOG.md. Every paid pin recovery also
records its actual observed kit-template cut, so manual recovery can use the
pin without acquiring a prism. Current combined-wave reader decisions belong
to the audited shared integrator named in INTEGRATION.md.

## Relationship to the five old-project ideas

- Artifact sets: new physical-piece/partial-assembly/function compiler.
- Item-triggered encounters: new common item gate and paid response compiler.
- Creature capture: existing persistent actors/inventories/controllers/party
  are suitable retained owners. Converting a real native hostile into the same
  persistent creature still needs a selected identity/combat/capture adapter;
  this delivery does not claim one.
- Distinct enemies: use existing authored encounter/native battle response
  owners; no shared damage/stat equivalence is imposed by this compiler.
- Recurring companions: existing directed memories, stable people and local
  controllers remain their owners. Content can reuse those services.

Inspiration is Weibao's AP CSP Deluxe Meme RPG, supplied public revision
`8023b3cc723134abdb326d42bf8a4f87b3020735`, collection/gauntlet and gated orb,
scroll/Pokeball events. New compiler and Vela content are original; old Python
source is not ported or bundled. A future literal source-world adaptation must
follow PROJECT.md edition/continuity/attribution rules.
