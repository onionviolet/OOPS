# Theory of Magic implementation candidates

Proposal-only packets. No implementation is authorized by this audit. Parent selects scope after current playable acceptance work. Use the current native transaction, time, reward and save owners; line anchors describe inspected files and must be rechecked against live edits. No reference code or lore transplant.

## P1 Make study change what a character can do

**Source:** [data/tasks.json:69-87](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json#L69); [data/resources.json:11-34](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/resources.json#L11); [data/skills.json:17-37](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/skills.json#L17)

**Proposed behavior:** Read a short field manual, practice its method, and use it in one native gathering task. Keep reading progress separate from trained skill and equipped means.

**Native map:** `src/items.js:1092-1152; src/data/skills.js:2539-2565; src/activities.js:130-135`

**Smallest slice:** A native book plus one useful gathering technique; Literacy still earns XP and the old book rewards remain intact.

**Proof:** Book reading reaches completion; technique is learned but cannot execute without its declared tool; gather with tool and see the practical outcome.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P2 Let the Shack become a working home

**Source:** [data/furniture.json:324-356](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/furniture.json#L324); [data/furniture.json:391-403](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/furniture.json#L391); [data/homes.json:3-9](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/homes.json#L3); [data/homes.json:46-85](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/homes.json#L46)

**Proposed behavior:** Craft a reading stand or workbench for the Shack; choose a practical benefit that applies only while using that place. Start with one furnishing, not a universal room-slot system.

**Native map:** `src/data/locations.js:348-370; src/crafting_recipes.js:45-101; src/items.js:1092-1152`

**Smallest slice:** One crafted study stand changes one book task at the Shack and records that the player furnished their home.

**Proof:** Enter Shack, compare reading rate before/after installation, leave and verify location-specific benefit ends; reload/import preserves one installation.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P3 Show why a routine stopped

**Source:** [src/modules/runner.js:573-618](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/runner.js#L573); [src/modules/runner.js:636-659](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/runner.js#L636); [src/ui/panes/running.vue:69-132](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/running.vue#L69)

**Existing foundation:** `src/simulation.js:311-329` already supports counted programs and pause/resume. Integrate or explain the existing owner; do not add a competing runner.

**Proposed behavior:** Give native activity/read/craft rows a clear blocked reason and optional stop-at-goal. Propose a repeat/rest/resume cycle only after its native host is checked.

**Native map:** `src/activities.js:16-79; src/main.js:2248-2301; src/display.js:4457`

**Smallest slice:** One task stops at its resource or target limit, says why, and needs no hidden click loop.

**Proof:** Run to target, exhaust the declared resource, stop manually, change location and verify no old task resumes by accident.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P4 Make an apprenticeship a chapter in a life

**Source:** [data/classes.json:25-105](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L25); [data/classes.json:107-155](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/classes.json#L107)

**Proposed behavior:** Offer an optional village craft apprenticeship: ordinary job work trains the trade, mentor tasks unlock a practical method, and graduation adds a recorded title. Existing fieldwork remains available.

**Native map:** `src/activities.js:84-97; src/data/locations.js:345; src/crafting_recipes.js:45-82`

**Smallest slice:** One mentor and one commission with an explicit completion consequence.

**Proof:** Accept, defer, earn reward exactly once, and verify native quest/job access remains; inspect reload/import for title and commission.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P5 Keep basic learning useful beyond its first unlock

**Source:** [data/skills.json:248-287](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/skills.json#L248); [data/modules/learning.json:109-142](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/learning.json#L109); [src/items/skill.js:15-25](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/items/skill.js#L15)

**Proposed behavior:** Use a specific Literacy or Meditation milestone to improve one later task, with a visible causal explanation. Avoid a compulsory generic research bar across worlds.

**Native map:** `src/data/skills.js:2539-2565; src/activities.js:130-135; src/items.js:1128-1131`

**Smallest slice:** One learned practice changes a later recipe or reading task through an existing skill check.

**Proof:** Compare below/above threshold and show the exact changed cost or result; verify bonus applied once and persists.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P6 Turn expendable notes into lasting understanding

**Source:** [data/tasks.json:932-960](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json#L932); [data/modules/sublimation.json:9-73](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/modules/sublimation.json#L9)

**Proposed behavior:** Bind gathered notes into a manual, then optionally consume a copy to learn a permanent local method. Keep the source book and understood method distinct; do not assume knowledge guarantees execution.

**Native map:** `src/crafting_recipes.js:45-101; src/items.js:1092-1152`

**Smallest slice:** One note-to-book recipe and one optional learned technique, using native item transactions.

**Proof:** Insufficient notes spends nothing; valid craft debits exactly once; study preserves native book semantics; reload/import does not duplicate method.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P7 Put progress explanations in the existing center menu

**Source:** [src/ui/items/skill.vue:29-55](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/items/skill.vue#L29); [src/ui/panes/resources.vue:14-49](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/panes/resources.vue#L14); [src/ui/components/filterbox.vue:32-53](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/components/filterbox.vue#L32)

**Existing foundation:** `src/display.js:4457-4471` already renders reading remaining time and progress. The proposed delta is a causal reward/requirement explanation.

**Proposed behavior:** Show current progress, goal, known prerequisite and practical reward on one task row; add a filter only when the list is large. No Theory layout transplant.

**Native map:** `src/display.js:103-108; src/main.js:2248-2301; src/items.js:1138-1152`

**Smallest slice:** A reading row states time remaining and what completion will allow, respecting undiscovered information.

**Proof:** Fresh browser verifies narrow/normal width, keyboard operation, disabled reason and no hidden-world spoiler; screenshot the exact changed row.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

## P8 Explore prestige that preserves a lived character

**Source:** [data/hall.json:27-34](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/hall.json#L27); [data/hall.json:64-73](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/hall.json#L64); [src/modules/hall.js:137-149](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/hall.js#L137); [src/ui/hall/hall.vue:42-50](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/hall/hall.vue#L42)

**Proposed behavior:** Consider a later mentor hall or legacy archive where accomplishments aid a new character without erasing the existing one. Keep travel, learning, death and prestige separate.

**Native map:** `PROJECT.md: Accepted decisions; src/save_files.js; src/chronicle.js`

**Smallest slice:** Design-only retention matrix for one prestige layer; no reset code or extra-character implementation authorized.

**Proof:** Before implementation select ownership, retained goods/knowledge/relationships, import semantics and one exploit test; then fresh-origin save/reload/import.

**Exclusions:** Other worlds, universal skill caps, global reset changes, copied dialogue, new windows and parallel clocks/inventories.

**Persistence:** Additive and migrated/defaulted state where needed; preserve old saves. All gates unrun. Rebuild and fresh-origin browser proof, then save/reload/import for durable behavior, before calling gameplay verified.

