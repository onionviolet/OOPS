# Broader creature engine

```receipt
build: 415b603ef59ca637b3d3e32ca7a147ce4e546cffda587f7c87d53773d4a5d202
route: fixture(Village fleece, weaving and courier with Crafting access and skill seeded)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 34 focused tests, architecture, scoped rules checks, frozen MCP, and rebuilt desktop combined route
review: none
surface: agent-verified fleece, cloth, and construct delivery
```

Goal authorized November 11. Base b92e1e87f with many shared edits. Preserve existing work and standing priorities. This slice starts with a new leaf and focused test, then integrates the current Village meadow and one non-breeding carrier. [Design proposal](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md#creature-rules-enhancement-and-invention-2026-11-11-proposal) · [Lifecycle receipt](../creature-lifecycle-2026-11-11/CHECKPOINT.md) · [Architecture](../../../ARCHITECTURE_RULES.md).

- AR3, AD38, AD49, AD51, AD52. The shared seam names measured capabilities and composes local methods. Hosts own creature identities and layers, local resources, clocks, custody, knowledge and persistence. Use host bindings and the existing recipe and job owners. Local mechanisms remain extensible by world.
- Fleece proof: compare the same loom with ordinary versus fine fleece. Follow a heritable trait from a settled birth through paid animal care and shearing, through a real stack, into a different cloth result that the player can use. Preserve ordinary Wool and older pen records. Check failed binding, unchanged stock on refusal and a save between production stages.
- Carrier proof: a particular construct or familiar acquires a body alteration using actual means. A delivery with a known route and exact payload fails without the effective capability, then can complete and transfer the same payload with it. Check changed route conditions, a saved pending delivery and exactly-once settlement. Keep Gu-specific rules with the Gu owner.
- Desktop target: 1920x1080 in the relevant existing panel or action surface. Show the method, prerequisites and actual result. Mobile remains deferred by standing direction. PRS4/PRS6 sample from the meadow: “Brush and inspect sheep.”

## First implementation

- The shared leaf `creature_methods.js` measures a capability in declared units, records where each contribution came from, and plans a bounded ordered sequence of world-local operations. Each operation binds actual typed roles. A failed binding or later operation publishes no intents. Host transactions will reserve and publish actual inventory, creature changes and deliveries.
- `node --test tests/creature_methods.test.js tests/creature_lifecycle.test.js tests/creature_layers.test.js`: 20 pass. New fixtures cover fleece variation, load capacity from body and harness, composition of fitting and dispatch, and a failed route after a successful earlier step. They prove the contract in isolation. No playable outcome claimed yet.
- `npm run check:arch` and explicit receipt lint passed. No composition-root lines changed. No commit, push, or shared reserve use.
- Next: integrate actual fleece. Current Wool and Wool cloth are ungraded, and the existing quality propagation from harvested stock is butchery-specific. Preserve the ordinary recipe and use native item/recipe support for a fine fleece lot and a distinct cloth result, or extend the existing native quality path if it fits with less ownership overlap. Give that cloth a real existing garment or trade consumer. Recheck the live shared diffs before editing either route. For delivery, follow the native request, job and inventory owners for handoff, persisted progress and exactly-once receipt. Keep this goal active until both rebuilt proofs pass.

## Fleece through native cloth

- Prior turn was progress. Village uses the shared method to bind the actual sheep and resolve fleece fineness from lineage. The shepherd's ram supplies a fine-fleece trait for subsequent broods, with an unset-trait migration for existing rams. Pending broods keep their saved inheritance. Mature lamb care spends one hay; shearing requires six elapsed minutes and yields one finite clip. The separate native Fine wool cloth recipe consumes five Fine wool and creates a bolt valued at 18 versus 8 for ordinary Wool cloth. It is also a supported scarf input. Ordinary wool and cloth remain supported.
- `node --test tests/habitat_care.test.js tests/creature_methods.test.js tests/creature_lifecycle.test.js`: 26 pass. The new test refuses immature shearing and missing hay, keeps a pending clip across JSON restore and checks distinct material and no duplicate output. Architecture, player text and scoped whitespace passed.
- `BUILD_OUT=/tmp/yair-fleece-build.qwoIsq npm run build` passed. `PROOF_FLEECE=1 PROOF_URL='http://127.0.0.1:19649/?test_hooks=1' PROOF_OUT=/tmp/yair-fleece-build.qwoIsq/receipt.json node scripts/modular_seams_browser.cjs` passed at 1920×1080. Native breeding and shearing produced Fine wool. The fixture seeded Crafting access and skill after shearing. The same native Tinkering surface crafted both cloth products from their respective wool. Literal save/reload/export/import retained Fine wool cloth. A test-harness placement bug initially skipped the crafting action and was corrected before the passing proof. No market sale or scarf fabrication was exercised.
- Next: implement the second actual method consumer. Keep an identified carrier and payload in host custody throughout a paid alteration and timed delivery. The altered body must make a previously unavailable delivery feasible. Reuse existing held-item transactions, job/clock semantics and exact-once recipient credit. Then rebuild and prove both routes together. No reserve use or shared composition-root changes.

## Construct delivery and combined verification

The previous turn was progress. The reed construct has stable lifecycle identity and location. The shepherd's single funded order asks for two loaves. The bare body carries 300 grams; a wool-cloth sling fitted using the existing creature-layer mechanism contributes 450 grams. The 600-gram parcel fits only after alteration. Fitting and dispatch use the same typed, world-local operation and effect-intent contract as fleece, with different units and resolver rules. The meadow's native transaction removes cloth and bread, holds the exact parcel on the construct's order, and settles it into the shepherd's distinct inventory at the gate. Early recall returns the same bread; arrival and confirmation pay the fee once.

- Focused creature, layers, methods and habitat suite: 34 pass. Refusal for an overloaded bare frame, missing cloth and premature arrival were checked. Recall, re-dispatch, in-flight JSON restore and exact-once recipient credit passed.
- Isolated build passed with the SHA-256 in this receipt. Frozen MCP build `9dee445a6b18f098ec96ea086f5e803025523baed700a4770da01f62f8f8aeb9` opened the real meadow, hired the construct, and showed both missing cloth and over-capacity refusals.
- Fresh 1920x1080 Chromium on the isolated build, `PROOF_FLEECE=1` via `scripts/modular_seams_browser.cjs`: ordinary and fine fleece produced different cloth. The ordinary cloth paid for the sling. The same construct dispatched, persisted with both loaves through reload, and delivered them after eight minutes. The fee increased the purse by six, the shepherd inventory held both loaves, and literal export/import preserved the delivered state and fine cloth. Browser receipt `/tmp/yair-courier-build.bfU91I/receipt.json`, zero page errors.
- Architecture and scoped whitespace passed. Repository-wide `check:rules` stopped on a missing fenced receipt in the unrelated `open-craft-invention-2026-11-11/CHECKPOINT.md`. This task's receipt, rules index, direction sync, player text, names and continuity were checked independently and passed. HP clock and private-pack routing warnings remain in shared work. The full suite is the committer's pre-commit gate under AD36. No commit, push, human review or shared reserve use.
