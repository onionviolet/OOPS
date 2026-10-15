# Aspect pass

Status: PARTIAL. Source-only survey at the three revisions in [TOOLING](../TOOLING.md). `covered` means the bounded mechanism is documented from C#, not that game assets or runtime are complete. Priority A01, A03 and A04 were read first in the aspect pass. No raw dialogue or source code is reproduced.

## A01: partial

**Shown:** Dialogue components contain speaker owner, condition, jump, variable changes and trigger data. Controllers are per player. NPC text is randomly selected from eligible lines; player answers are condition-filtered and checked again by answer ID. Server triggers can take/give inventory, repair held equipment or alter the encounter. Scoped variables save separately. Integer reply IDs are assigned by load order, not immutable authored IDs. Full dialogue/localization assets, line counts and an actual paid branch are unread because they are not in these repositories.

**Sources:** `vssurvivalmod/Systems/Dialogue/BehaviorConversable.cs`, `vssurvivalmod/Systems/Dialogue/Component/DialogueComponent.cs`, `vssurvivalmod/Systems/Dialogue/Component/DlgTalkComponent.cs`, `vssurvivalmod/Systems/Dialogue/VariablesModSystem.cs`.

**Inferred YAIRPG PROPOSALS:** P19 / dialogue owner: use known conditions and recheck at commit; keep YAIRPG stable IDs and staged host transactions. Characters/items owner: a repair can retain repairer and count, but a trigger API does not prove atomic paid choice.

## A02: partial

**Shown:** Journal assets name entries, categories and chapter pieces. Per-player journal and discovered chapter records are distinct; repeated already-known discoveries return without adding a new chapter. Source includes old-format upgrade and error handling. Story text and actual narrative schedule are absent from the acquired assets.

**Sources:** `vssurvivalmod/Systems/Journal.cs`, `vssurvivalmod/Systems/Dialogue/BehaviorConversable.cs`.

**Inferred YAIRPG PROPOSALS:** Knowledge/journal owner: keep discovered chapters distinct from the available corpus; a duplicate discovery should not invent new evidence.

## A03: covered

**Shown:** C# modules use ModSystem lifecycle hooks, registries and JSON-backed content contracts. Survival registers concrete blocks/entities/behaviors; API owns generic recipe/stack contracts; essentials supplies shared inventory/world/AI helpers. Server logic and client GUI/renderers are separate. Timed callbacks and dirty/save hooks connect them. Container ticks cache climate lookups and skip work when no stack needs transitions. The proprietary engine loop itself was not acquired.

**Sources:** `vssurvivalmod/Systems/Core.cs`, `vsessentialsmod/Inventory/InWorldContainer.cs`, `vsapi/Common/Collectible/Collectible.cs`, `vsapi/Common/Crafting/RecipeBase.cs`.

**Inferred YAIRPG PROPOSALS:** Engine/authoring owner: keep domain mutation in its owner and projections in UI; share a helper only after distinct real consumers need it.

## A04: partial

**Shown:** Block entities serialize inventory and process fields in attribute trees. Anvil saves workspace shape/work stack/recipe/rotation; removed work carries shape on the stack. Clay saves shape and available material. Stack transition attributes retain sampled durations and timestamps. Dialogue variables and journal dictionaries use world save data with protobuf helpers. Journal has an old-version upgrade; clay has a missing-base-material fallback. Content mapping hooks resolve item IDs. Whole save-file framing, autosave guarantees, crash atomicity and native roundtrips are unread.

**Sources:** `vssurvivalmod/Systems/Barrel/BEBarrel.cs`, `vssurvivalmod/BlockEntity/BEAnvil.cs`, `vssurvivalmod/BlockEntity/BEClayForm.cs`, `vsapi/Common/Collectible/Collectible.cs`, `vssurvivalmod/Systems/Dialogue/VariablesModSystem.cs`, `vssurvivalmod/Systems/Journal.cs`.

**Inferred YAIRPG PROPOSALS:** Persistence/engine owner: retain exact pending work and RNG draws, and define content mismatch/default behavior before adding fields. Do not borrow silent reset/fallback as a universal YAIRPG compatibility policy.

## A05: partial

**Shown:** AI registry maps task codes to C# types. Tasks occupy slots; a candidate can preempt the old task by priority versus cancellation priority and eligibility. Start/stop callbacks and optional shuffling use world state/RNG. This is not a demonstrated independent social/economic simulation. Concrete NPC schedules and authored content remain unread.

**Sources:** `vsessentialsmod/Entity/AI/AiTaskManager.cs`.

**Inferred YAIRPG PROPOSALS:** Character/activity owner: distinguish concurrent channels and interruption rules; no new population simulation is justified by this source sample.

## A06: covered

**Shown:** Handbook links creation and ingredient uses from recipes with variant-correct outputs. Barrel GUI juxtaposes held content and output/time and uses a liquid fullness gauge. Anvil reports heat/tier; smelting text names required station/container. These are code-level UI paths, not screenshots or layout acceptance. Barrel no-match does not explain each failed quantity predicate.

**Sources:** `vssurvivalmod/Systems/Handbook/CollectibleBehaviorHandbookTextAndExtraInfo.cs`, `vssurvivalmod/Systems/Barrel/GuiDialogBarrel.cs`, `vssurvivalmod/BlockEntity/BEAnvil.cs`, `vssurvivalmod/Inventory/InventorySmelting.cs`.

**Inferred YAIRPG PROPOSALS:** P01/P02 and thematic UI owner: show side-by-side uses and exact live blocker on a 1366x768 desktop; do not equate reference help with executable admission.

## A07: partial

**Shown:** Content types expose JSON-documented recipe and transition fields and resolve symbolic item/liquid identities to runtime objects. Lifecycle order includes asset load/finalize; code class registries attach behavior. Recipe flags can copy/merge input attributes, gate traits or hide a creation entry. Complete load-order resolution, all validation and shipped JSON are unread.

**Sources:** `vssurvivalmod/Systems/Core.cs`, `vsapi/Common/Crafting/RecipeBase.cs`, `vssurvivalmod/Systems/Recipe/Barrel/BarrelRecipeIngredient.cs`, `vsapi/Common/Collectible/TransitionableProperties.cs`.

**Inferred YAIRPG PROPOSALS:** Engine authoring owner: make per-recipe input policy explicit; avoid assuming all optional hooks are active for vanilla content.

## A08: partial

**Shown:** Source shows bounded temperature-to-perish rates, sampled duration distributions, random yield rounding, durability averaging and repair material fractions. Wiki supplies stated hide/liquid/timer balance values. Shipped JSON balance and RNG persistence across the full engine are unverified.

**Sources:** `vsessentialsmod/Inventory/InWorldContainer.cs`, `vsapi/Common/Collectible/Collectible.cs`, `vssurvivalmod/CollectibleBehavior/BehaviorWearable.cs`.

**Inferred YAIRPG PROPOSALS:** Materials/crafting owner: preserve sampled lot parameters and quantity conservation; treat copied numeric balance as unsuitable for original YAIRPG design.

## A09: covered

**Shown:** Barrel completion compares calendar hours with seal time. Stack transitions accumulate effective calendar hours when updated. Generic containers skip unloaded-room ticks; transition conversion performs one step per update and notes incomplete fast-forward support. Current condition can apply over an elapsed interval. Offline application-closed progression is not established.

**Sources:** `vssurvivalmod/Systems/Barrel/BEBarrel.cs`, `vsapi/Common/Collectible/Collectible.cs`, `vsessentialsmod/Inventory/InWorldContainer.cs`.

**Inferred YAIRPG PROPOSALS:** Clock/job owner: settle interval boundaries and define chained completion explicitly; do not add automatic offline catch-up from this reference.

## A10: partial

**Shown:** First-steps tutorial uses press, collect, craft, look, grab and place milestone types. Receive watchers filter event names and stack predicates; existing-inventory checks apply to collection milestones with inventory exclusions. Comments list future steps not implemented in this class. Full reveal order and tutorial persistence are unread.

**Sources:** `vssurvivalmod/Systems/Handbook/Tutorial/FirstStepsTutorial.cs`, `vssurvivalmod/Systems/Handbook/Tutorial/PlayerReceiveItemWatcher.cs`.

**Inferred YAIRPG PROPOSALS:** Onboarding/knowledge owner: teach by observable useful outcomes and label planned steps separately from implemented ones.

## A11: covered

**Shown:** Code includes seal sound, liquid texture/fullness meter, rendered retained workpiece geometry, prior-answer styling, linked item slideshows and spacing constants. The dossier lists thirty touches; visual/audio effect quality was not tested.

**Sources:** `vssurvivalmod/Systems/Barrel/GuiDialogBarrel.cs`, `vssurvivalmod/Item/ItemWorkItem.cs`, `vssurvivalmod/Systems/Dialogue/Component/DlgTalkComponent.cs`, `vssurvivalmod/Systems/Handbook/CollectibleBehaviorHandbookTextAndExtraInfo.cs`.

**Inferred YAIRPG PROPOSALS:** UI/feedback owner: make each cue communicate retained state or the next useful action before adding decorative work.

## A12: partial

**Shown:** Wearable condition, repairer provenance and task interruption add useful connections. Directory inventory also finds trading, agriculture, mechanics, boats, world generation, weather and temporal systems, which are unreviewed beyond file inventory. They are not implicitly acquired feature proposals.

**Sources:** `vssurvivalmod/CollectibleBehavior/BehaviorWearable.cs`, `vssurvivalmod/Systems/Dialogue/BehaviorConversable.cs`, `vsessentialsmod/Entity/AI/AiTaskManager.cs`.

**Inferred YAIRPG PROPOSALS:** Crafting/characters owner: one provenance field needs an actual later consumer; keep wider donor systems reachable without making them current gates.
