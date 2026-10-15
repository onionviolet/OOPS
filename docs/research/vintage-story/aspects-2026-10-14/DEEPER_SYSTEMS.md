# Three deeper systems selected by payoff

These were initial source-coverage gaps after the prior wiki scout. Each is now documented in a bounded form; shipped assets and native verification remain open. Paths resolve under the pinned repositories in ../TOOLING.md. All YAIRPG uses are proposals.

## DS1: Dialogue is stateful, with separate variables and host effects

**Shown:** `Systems/Dialogue/BehaviorConversable.cs` loads a dialogue configuration and creates a controller per player. `DialogueComponent.cs` carries code, owner, conditions, jumps, variable updates and trigger data. `DlgTalkComponent.cs` filters lines; NPC text chooses an eligible variant, player choices pause execution. Selection resolves an integer ID and checks eligibility again before jumping. IDs are allocated while initializing content, so content-order stability is a separate problem. Used-answer styling lives in a local set; it is not proof of a durable completion flag.

The behavior's trigger switch includes server-side inventory take/give and equipment repair. Repair retains last repairer and a count on the stack. `VariablesModSystem.cs` separates player/group/global variables from entity watched attributes and saves the shared variable data through world-save hooks. These reads establish implementation routes for dialogue effects, not a tested atomic paid exchange. Exact authored dialogue, eligibility tables and corpus counts are absent with the paid assets. Full decoded execution is saved privately in ../private/fs-vintage-story/DECODED_FLOWS.md.

**P19 takeaway:** current YAIRPG scoped Ink and native hosts already stage useful choices. Borrow the link between conditions and later effects; keep its stronger stable IDs, staged cursor/payment and failed-publication contract. A concrete later packet would prove one paid exchange and changed continuation, without introducing a second dialogue engine. Owner: dialogue/interactions and character/item records.

## DS2: Ambient storage is a rate provider over a retained lot clock

**Shown:** essentials `Inventory/InWorldContainer.cs` queries room and climate, caches shared temperature for a tick, and calls stack transition updates only when needed. API `InventoryBase.cs` multiplies default rates and callbacks; API `Collectible.cs` keeps sampled thresholds and effective elapsed hours on each stack. Perish reads a climate/light/cellar function. Generic dry/melt uses a storage multiplier; Cure does not automatically acquire a new humidity simulation. The barrel contributes a zero multiplier for a valid sealed recipe.

There are two useful limits: historical weather is not integrated over an entire skipped interval, and one conversion per update does not completely settle chained fast-forward. A condition change needs an old-interval settlement if YAIRPG wants precise causal progress. Positional transition arrays append for additional properties, but this does not establish safety under property reorder/removal. Full formula and tables remain accessible at pinned source; no proprietary code is redistributed.

**CH takeaway:** trial one existing dry-to-kit consumer, then a local drying law if a second reader is useful. Retain the lot's threshold draw and progress, and make time policy explicit. Owner: modular production chains, material/batch/process/product contract and clock. No app-closed catch-up is added by inference.

## DS3: Recipe output policy determines whether component identity survives

**Shown:** API `RecipeBase.GenerateOutputStack` clones the resolved result, optionally copies one input's attributes or merges named inputs, then calls output crafting behavior. Output values take precedence in the attribute merge. API `Collectible.OnCreatedByCrafting` can average durability and transfer perish freshness. Wearable crafting/repair logic adds condition and durability changes in survival `CollectibleBehavior/BehaviorWearable.cs`.

This is a fixed recipe with explicit propagation hooks, not a universal assembly where every part becomes a permanent nested child. Wiki-stated head/stick and armor stages show materials feeding useful output; missing vanilla JSON means head/handle property contribution is still unverified. A component's material variant, current stack attributes and post-assembly inheritance are separate facts.

**CH/P02 takeaway:** extend one current workshop or kit contract with a declared relevant part property only if current source lacks that consumer. Quote consumed/reusable parts and output effect together. A changed part must alter a real useful result, and failed durable write must preserve every original part. Owner: crafting/consumables, weaponcraft and existing audited fixture/kit hosts.
