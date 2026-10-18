# S4 Knowledge, recipes, books, tinkering and material use

The useful distinction is knowing what an object is, knowing a construction method, possessing a reference, meeting the method's means, and using its real output. Those states have different owners in this build.

## S4a Identification is its own state

Examiner retains per-object EpistemicStatus and a game-based UnderstandingTable keyed by tinkering blueprint. Its states include uninitialized, unknown, partial and known. Write/Read retain object fields; SaveGlobals/LoadGlobals retain the shared understanding dictionary. This is not a demonstrated independent belief model for every NPC.

Examine checks breakage, body movement, intelligence/difficulty, confusion and inspection bonus events, warns about another owner's item, and then follows an ordinary roll or optional Sifrah route. Partial progress, failure and critical failure differ. The examined attempt's normal tail spends 1000 energy; early refusals/cancel return sooner. Failed examination can request leaving the interface and cause harmful outcomes. Display name, category and gender substitutions consult understanding unless an AsIfKnown path is requested. A truthful engine sample used in a crafting preview is not necessarily the player learning the object's identity.

## S4b Closed data-disk construction and actual output

TinkerData.TinkerRecipes derives build recipes from baked blueprints and modification recipes from ModificationFactory, rather than enumerating a universal freeform invention engine. TinkerItem.LoadBlueprint rejects base objects, NoDataDisk, non-buildable and substitute-blueprint entries. It derives tier, bit cost, ingredient alternatives and category. [Indexed TinkerItem-bearing definitions](private/TINKER_BLUEPRINTS.json) are broader than the final runtime recipe pool; their 964 candidates must not be called 964 usable recipes.

| Stage | Disk/reference route |
|---|---|
| Knowledge | An understood DataDisk exposes Learn and, for Build data, Build. Learn refuses known recipes or missing required skill, appends to TinkerData.KnownRecipes, then destroys the disk. |
| Reference without learning | BuildFromDataDisk uses that disk's Data directly. Its inspected success path does not add known knowledge or destroy the disk. A reference can supply a method while it remains present. |
| Eligibility | Data tier maps to Tinker I through tier 3, Tinker II through 6, otherwise III. Skill, bits, hostile-combat event and usable extremities are checked. Optional Ingredient is a list of explicitly permitted blueprint alternatives found in inventory. |
| Payment/output | Ingredient removal is attempted first, bits are consumed, concrete blueprint objects are created/processed and added to the actor's inventory, then 1000 energy is spent. NumberMade controls batch size with a minimum of one. |
| Failure/removal | Removal refusal, insufficient stock, body/hostile conditions and missing skill differ. Calls and ordering do not prove full transactional rollback. TinkerData.UnlearnRecipe removes a known blueprint entry; this is distinct from identifying an object or dropping a disk. |
| Persistence | TinkerItem.SaveGlobals stores per-blueprint bit assignments and known recipe composites; XRLGame invokes it. Each produced object/inventory has its own serialization route. |
| UI | Disk inspection shows output/requirements/known status; context actions expose reference verbs. Modern tinkering lists known Build/Mod data and dispatches shared build/mod helpers. |

A specific configured output is Gaslight Dagger (gaslight kris), whose source declaration is buildable and has an energy-cell socket, Gaslight weapon part and charged-only light. DataDisk can target that blueprint; a conditional valid disk/skill/bits execution therefore creates the same blueprint type whose actual fuel/socket/weapon/light use is closed in the earlier [liquid trace](../idle-social-engine-scout-2026-10-06/traces/QUD_LIQUIDS.md). This is a source-connected example, not a spawned disk, native craft or proven recipe roll. Its fuel consumption, contamination refusal, last-partial-charge behavior and AI-query side-effect limits remain exactly as documented there.

The modern known-recipe build helper differs from direct disk build: it processes modified bit cost and bonus-mod events, then creates actual output, adds it to GO inventory and uses The.Player in some postprocessing/taken-event calls. That is a concrete actor-ownership caveat. Do not generalize this player UI helper into a safe NPC crafting service. Its entry UI ordinarily supplies the player; broader misuse was not tested.

## S4c Learning without a disk and book distinctions

Psychometry separates unknown-object identification from known-object construction insight. Rank controls identifiable/learnable complexity. The normal identification branch marks the object understood and spends energy. The construction branch records a LearnedBlueprints entry and a matching TinkerData recipe; this is still an existing template. Optional Sifrah reverse-engineering instead requires disassembly and possibly Reverse Engineer. `Activate` has its own exhaustion/reality rules. Do not claim every branch is free, or every known object is constructible.

TrainingBook uses a per-book read key on the actor, adds a configured skill or one attribute point once, and supports NPC bored-reading. Initiatory books advance through their special sequence. A normal book route is not interchangeable with this training component. MarkovBook retains BookSeed/BookCorpus, selects a full-book versus fragment route deterministically from seed/world context and tracks reading through a game-state key. Its prose is generated presentation and does not itself establish a taught recipe. Full generated-book distribution and all secret insertions were not audited.

WaterRitualTinkeringRecipe and Tinkering_Tinker1 are retained as adjacent acquisition paths. The latter has a one-time starter-recipe grant and Recharge ability. They are not silently counted as complete closed learning/use chains; full selection/payment semantics for every teaching source remain open.

## S4d Reused food and materials findings

The [jam/jerky trace](../procedural-crafting-ui-2026-10-15/QUD_INGREDIENT_RECIPE_USE.md) already closes raw ingredient → preservation → domain-based effect generation → inspiration choice → learned recipe note → recook → HP change. Reuse its complete Foods/Data/Skills tables, 66-domain map and 181 concrete implementation references instead of exporting the whole cooking system again.

Retained distinctions: experimental cooking can enumerate adjacent stock while known-recipe snapshots use carried/equipped stock; known blueprint components accept authored alternatives rather than all same-domain materials; recorded effect structure can coexist with rerolled initialization and trigger values. JournalRecipeNote.Reveal joins notes to knownRecipies. Journal deletion and campfire Hidden/Forget do different things. Low-health-triggered healing is a conditional event chain, not a guaranteed recipe draw or immortality. Full lethal ordering remains unresolved.

Liquid identity/composition, known recipe, bodily ingestion, fuel quality, socket support and actual charge draw are separate material consumers. The earlier liquid report's metered charge counter and mixture gates remain authoritative evidence at their named source windows. This audit does not map Qud energy, turns or ticks directly to YAIR played minutes.

## S4e Catalog and gaps

Full raw Books, Skills, Mutations, naming/faction/quest/population/relic/mod tables and all 14 supplied object-definition XMLs are retained privately with normalized trees. Control-character references rejected by standard XML 1.0 are removed only from derived parsing input and recorded; originals are unchanged. The inheritance index is a navigation aid, not Qud's executed ordered-mixin blueprint baker. Runtime recipe distribution, all disassembly outcomes, every substitution/mod, learned knowledge under domination, serializers in failure conditions and native use remain unverified.

## Core source locators

The complete methods remain private. Line starts refer to this packet’s exports; the ledger limits each claim’s semantic scope.

| Complete source | Method line |
|---|---|
| [XRL.World.Parts.Examiner.cs](private/source/XRL.World.Parts.Examiner.cs) | 208 |
| [XRL.World.Parts.Examiner.cs](private/source/XRL.World.Parts.Examiner.cs) | 399 |
| [XRL.World.Parts.DataDisk.cs](private/source/XRL.World.Parts.DataDisk.cs) | 200 |
| [XRL.World.Parts.TinkerItem.cs](private/source/XRL.World.Parts.TinkerItem.cs) | 201 |
| [XRL.World.Parts.TinkerItem.cs](private/source/XRL.World.Parts.TinkerItem.cs) | 239 |
| [XRL.World.Parts.Mutation.Psychometry.cs](private/source/XRL.World.Parts.Mutation.Psychometry.cs) | 148 |
| [XRL.World.Parts.TrainingBook.cs](private/source/XRL.World.Parts.TrainingBook.cs) | 99 |
| [XRL.UI.TinkeringScreen.cs](private/source/XRL.UI.TinkeringScreen.cs) | 766 |
