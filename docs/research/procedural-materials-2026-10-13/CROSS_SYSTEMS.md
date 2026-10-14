# Procedural materials across crafting and everyday systems

2026-10-13. Research and design proposals only. This pass inspected local source and existing owners; it changed no runtime, save, build or accepted direction. No browser or test execution is claimed. It owns only this file. Source may move under concurrent work.

## Finding and scope

**F1: Reuse material facts across different consumers, rather than reuse one potion formula everywhere.** A conductive ink, flexible handle and restorative salve need different process and use laws. Composition answers what is present; structure answers how it is arranged; a consumer answers what that product actually does. Author those laws and role grammars once, then derive combinations without a template for every variant.

Relevant owners: [prior implementation audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), [granular systems](../../GRANULAR_SYSTEMS_AND_INTERACTIONS.md), [resource uses](../../GATHERING_AND_RESOURCE_USES.md), [micro/workshop/macro research](../CRAFTING_TECH_MICRO_MACRO_2026-10-11.md), [assembly design](../../worlds/PROGRESSION_AND_ASSEMBLY.md), [PROJECT](../../../PROJECT.md) and [user vision](../../USER_VISION.md). Older source snapshots in those dossiers are historical evidence, not current implementation truth.

**F2: Useful seams already exist, but their coverage is narrow.** [Recipes](../../../src/crafting_recipes.js) support exact/type ingredient lookup, result hooks, component assembly, station/skill-dependent quality and authored per-material results. [Springsteel](../../../src/alloy_equipment.js) links one authored material profile to brace stats and one particular technique. [Durability](../../../src/absorb_e2/durability.js) provides optional instance condition and staged repair. [Reedbank](../../../src/local_livelihood_content.js) connects actual kits, methods, repair custody, collaborator means and finite customer payment. None establishes arbitrary alloy composition, building simulation or dynamic assembly.

**F3: Logistics is part of the generated product contract.** The [retort](../../../src/factorio_retort_content.js) has owned apparatus, finite site capacity, actual separate product/residue receivers and current-batch reservations. Its [native validation](../../../src/factorio_retort_native.js) intentionally admits five exact plain item keys. Extend the pattern deliberately; adding arbitrary mixture fields to those keys would violate its contract. Existing generated-consumable identity/application/restore gaps remain as reported by the prior audit.

All examples below are original proposals. Specific book materials and non-book materials can coexist. A shared role resolver must retain an exact canon ingredient, identity, sequence or ritual condition where the verified source requires it. A wiki can suggest a question; its authority and source locator must be recorded before presenting a direct adaptation as canon. This lane makes no new external-source claims.

## Ten contracts worth sharing

### C1: Functional roles with exact exceptions

A recipe slot declares amount/unit, role, relevant suitability requirements and exclusions. A handle asks for stiffness and grip suitability; an adhesive asks for bonding compatibility; a ritual can ask for an exact named ingredient. Slots may combine identity and property constraints. Show known fits as recommendations while allowing partly understood trials where the local workshop permits them. Actual properties decide the outcome.

**Playable result:** two available woods both make an owned tool, with a different handling or supported work function; one fails a genuinely unsuitable application. **Cost:** medium, extending native selection/preview and full-key reservation beyond existing type matching. **Minimal test:** exact-only, property-only and mixed slots; one stock unit cannot satisfy two overlapping slots unless explicitly apportioned. Preview neither consumes nor reveals an unknown property.

### C2: Transfer, transformation and structure are different operations

Each process specifies which constituents remain, which transform, where byproducts go and what structural property it establishes. Mixing preserves fractions unless a reaction consumes them. Burning wood does not transfer every wood property to ash. Binding a blade to a handle preserves two parts instead of averaging their strengths. A trace constituent survives unless an actual rule removes it.

**Playable result:** the same sap becomes either a binding medium or a differently useful processed fraction; heat treatment changes a metal's working behavior without magically teaching its maker. **Cost:** high shared prerequisite, requiring revisioned batch identity and ordered process resolution. **Minimal test:** input/product/waste accounting, retained catalyst, process-order counterexample and tiny contaminant across split/recombine. Allow declared fictional transformations without forcing universal real chemistry.

### C3: Smithing chooses composition and preparation separately

An alloy family defines compatible feedstocks, ratio ranges and a small set of meaningful outcomes. Forging, casting, annealing or quenching are authored process operators only where supported. Composition, workmanship, treatment and condition remain separate. A more rigid alloy may serve a brace while a more flexible one serves another actual application; expensive metal is not universally superior. Stable generated records avoid defining a new ingot template per ratio.

**Playable result:** one original Village alloy family yields two brace variants affecting a supported technique differently. **Cost:** high for general alloys, lower for a bounded extension after product identity exists. Springsteel is a useful current adapter example, not procedural metallurgy. **Minimal test:** identical input/process reproduces the result, incompatible stock leaves an accounted outcome, and equip/use/reload preserves its specific behavior rather than reverting to template stats.

### C4: Assembly checks interfaces and part responsibilities

Represent a product as a small authored arrangement of roles and interfaces. Fit, dimensions, attachment and channel compatibility matter when the selected assembly reads them. A good blade does not fix a loose connector. A suitable adapter can bridge two supported interfaces at an explicit cost. Do not apply a generic slot count to every device, outfit or ritual.

**Playable result:** replace or refit one handle or seal and observe an actual changed tool function; the remaining owned parts stay intact. **Cost:** high, because native equipment currently reconstructs component IDs and quality rather than arbitrary mutable mounts. **Minimal test:** wrong interface, adapter fit, one installed-part ownership, remove/reinstall conservation, and load preserving the arrangement. Buildings should begin as one functional installation with a site owner, not a voxel world.

### C5: Skill controls execution; apparatus supplies capability

A learned method, broad skill, precision, station capability and access are different requirements. Skill can improve extraction, fitting tolerance, waste or reliable working range through selected rules. A better vessel can enable a sealed process that hand skill cannot imitate. Measurements and estimates describe knowledge, not a second material truth. No control should exist unless changing it alters a supported result.

**Playable result:** a familiar material gains a useful preparation through a commissioned fixture or a learned technique, with a reproducible procedure afterward. **Cost:** medium using existing skill/station and staged-job seams, higher for persistent unfinished work. **Minimal test:** known method without access remains unavailable, apparatus without method permits only supported experimentation, cancellation follows the declared refund/retention policy, and inspection creates no progress.

### C6: Food, salves and coatings share batches but differ in delivery

Cooking derives a selected meal family from ingredient roles and preparation. A meal supplies useful benefits under accepted comfortable-unfed/no-hunger-death direction. Salves bind active fractions into a topical carrier. Coatings attach a finite amount to a real surface and release it through an authored exposure route. Oral, topical and contact effects are distinct; a material's beneficial tag is not universal healing.

**Playable result:** one herb preparation supports a drink and a salve with different native uses, or one meal has two meaningful preparations. **Cost:** high until generated effect payloads, restoration and stack policies exist; coatings additionally need actual host custody and remaining dose. **Minimal test:** route difference, dose accounting, repeated application, expiry and exact reload. Do not turn every food into expiry upkeep or make every hit invoke all stored potion effects.

### C7: Textiles, wood and inks retain useful geometry

Fibers can be spun, woven, layered or sealed through small process families. Wood can be cut/oriented/treated for a chosen part. Ink combines pigment, binder, solvent and any verified special reagent; writing also needs a supported pattern and substrate. Conductivity alone does not invent a spell. Paper, thread, seals and ordinary wood can stay useful because a selected advanced assembly genuinely uses their roles.

**Playable result:** a treated cloth improves one disclosed exposure use, or two inks create a known inscription with different supported endurance. **Cost:** medium for existing clothing stats, high for formations/enchanting because a real pattern execution consumer is still needed. **Minimal test:** relevant structure matters, unrelated ingredient powers do not copy, incompatible substrate is handled, and saved use retains the actual result. Generic formations remain deferred, not claimed as implemented.

### C8: Soil and farming need a managed-site consumer

Fertilizer is not a bag with an automatic universal crop bonus. One authored crop family can read nutrient suitability, moisture handling or a fictional affinity, with known growth boundaries and actual seed/site custody. Regional generated materials can correlate related traits so studying one family helps another. Stable generation occurs once per site/batch, not whenever inspected.

**Playable result:** invest a real cutting and suitable amendment in one local plot, then acquire a different dependable supply. **Cost:** high because ordinary harvesting declarations do not establish generic cultivation, depletion or ecology. **Minimal test:** spent inputs, wrong amendment, deterministic crop result, harvest once, and growth/reload under an explicitly supported clock. The existing retort residue has no crop benefit; adding one would need a deliberate new rule, not an inference from its name.

### C9: Repair restores function; salvage recovers declared parts

Repair can consume a compatible replacement, binder or offcut and retain object identity, history and ownership. Disassembly returns only recoverable parts; salvage converts others to accounted feedstock. Condition and repairs do not automatically raise structural tier. Valuable knowledge may survive dismantling while the physical object does not.

**Playable result:** repair a customer's actual item or choose to salvage an owned tool for a useful next craft. **Cost:** medium for a bounded repair using existing patterns, high for arbitrary assemblies. **Minimal test:** reserved/borrowed/disputed object rejection where applicable, partial recovery, one settlement, and craft→salvage→recraft yielding no free resources. Keep optional durability separate from mandatory wear on every item.

### C10: Methods become finite production and real demand

Save a procedure with exact selections or permitted substitutions, expected useful output and stop conditions. A queue repeats it using current stock, apparatus capacity and receivers. Price and customer acceptance read useful declared requirements, observed/certified evidence and actual demand, not the sum of glamorous tag names. NPC collaborators need their own supplies, methods, attention and payment. Sharing a discovery can unlock a bounded buyer or supplier without simulating a global market.

**Playable result:** reproduce a discovered preparation, supply a finite customer order, then receive one actual later offer. **Cost:** medium/high, reusing jobs/plans and Reedbank demand patterns but extending dynamic-output reservations and acceptance. **Minimal test:** shared-stock competition, full residue receiver, loss of access, changed input suitability, finite customer funds, replayed delivery, and continuation after reload. Closed-browser/offline operation needs a separately declared policy; elapsed wall time cannot invent production.

## Bounded recommendation and acceptance

**D1, proposal:** finish the prior audit's complete procedural alchemy slice first. Then add one further consumer, preferably an original binder/coating or a narrowly extended brace. It should reuse composition and process records while visibly proving a different application. That is a stronger reuse test than adding more potion names. The ten contracts are a design menu, not ten simultaneous implementation obligations.

First milestone remains one realm and one prestige layer. Proposed UI target is 1366×768 with a wider desktop check: compare input roles and known predictions beside selected amounts/procedure, then inspect and use the exact owned output. Mobile optimization stays deferred.

Future delivery requires current rebuild and a fresh origin journey through acquisition, preparation, useful application and repeat production. New persistent variants need explicit compatibility plus old-save, Save/reload and literal export/import evidence. Each selected consumer must demonstrate its own gameplay consequence; a resolver test, generic capability label or tooltip proves none of the others. Fiction/balance acceptance remains Weibao's review.
