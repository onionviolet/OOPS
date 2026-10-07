# ACS-P02 contextual balm leaf

Status: **implemented-unverified leaf**, delivered to the root integrator. The leaf owner releases the three source paths and this directory on this checkpoint. The root retains shared simulation, native effect publication, save, UI wiring, canonical files and build ownership.

## Behavior and boundary

This adds one original one-minute treatment in the existing `base.frontier` Village or Shack. It needs the actual current `body.scraped_hands` condition and one carried Healing balm that is not borrowed or equipped, with no native battle running. It uses the existing item key `{"id":"Healing balm"}`, recipe, stock, custody, ownership, body state, common played clock, simulation job, conditions, knowledge, and native publication. It adds no new item, recipe, stock, clock, publisher, save domain or condition identity.

The only body condition removed is `body.scraped_hands`. `body.sore_hands`, permanent marks, learned grip, previous injury accounts, health and stamina stay under their existing owners. Existing `body.recover` remains three free played minutes. Ordinary native `use_item` is unchanged.

The source packet adapts interruption behavior to this simulation's existing refund contract: cancellation, lost completion support, or natural scrape expiry before the paid minute completes returns the exact reserved item, leaves elapsed time spent, and creates no completion receipt/effect. Completed useful work spends the reserved balm. This is not a copied source game's interruption/reward policy.

## Files and exports

- `src/contextual_balm_content.js`: `CONTEXTUAL_BALM_DEFINITIONS`, stable IDs, and the native effect request template.
- `src/contextual_balm_facts.js`: pure actual-body, current scrape, current location, carried item, custody/equipment and current effect facts; `contextualBalmContext`; optional saved-state validation.
- `src/contextual_balm_host.js`: `CONTEXTUAL_BALM_INTERFACE`, command commit/cancel wrapper, presentation, and `stageContextualBalmEffectRequest`.

Root integration registers the command definition, composes these facts at preview and completion, routes the contextual command/presentation, calls the validator, and passes the stage request into the existing `nativePublication` writer. The same existing staged save envelope must validate and persist before its post-durable `publish()` applies the native in-memory effect. The leaf never edits `active_effects` or the envelope. It does not stamp a new schema.

The one completion receipt is the optional simulation knowledge record `contextual_balm.treatment`, caused by the completed job, paired with actor fact `contextual_balm.version = 1`. A pending exact job may exist before either completion marker. Absence remains inert. No expansion or simulation schema bump is needed: the feature reuses existing condition, actor fact, knowledge, item reservation and job primitives supported by expansion5–11 and simulation4. Its exact command IDs need the matching reader/definition registry as usual. It introduces no domain of its own, creates no mirrored body/native-effect record, and does not reinterpret old saved jobs. No private save is read or changed.

## Native effect request contract

The request targets the existing item template `Healing balm` and its exact effect key `Weak healing balm`, duration 90. Its serialized `ActiveEffect` template is pinned in `CONTEXTUAL_BALM_NATIVE_EFFECT_REQUEST`: `name`, null `description`, native health-regeneration stats (flat 5 and percent 0.5), constructor-added empty `bonus_skill_levels`, `affected_by_travel:true`, `base_xp_value:1`, `tags:{effect:true,buff:true,medicine:true}`, empty `group_tags`, and potency 0. The game’s existing `ActiveEffect` constructor is the source of this shape.

The effect has no group tags, so `add_active_effect` has no stronger-effect group to compare for this exact template. The bounded adapter contract preserves every other active effect and merges the existing `Weak healing balm` duration after normal played-time decay with 90 using `max(existingRemaining, remainingNewDuration)` where `remainingNewDuration = max(0, 90 - (plan.clock - receipt.at))`. The 90 minutes start at the actual completion receipt time, so a joined advance that runs past completion decays the newly earned effect normally. If the full 90 minutes already elapsed before the joined plan is published and no prior same-key effect remains, no native insertion request is emitted; the completed treatment receipt and spent balm remain. This preserves a longer same-effect duration and never replaces a stronger distinct effect. A successful dressing still spends its accepted balm because the scrape treatment completed, even if the effect was already at least 90 minutes. This contextual merge repairs the truncation/refund ambiguity without changing ordinary `use_item` behavior.

Ordinary `use_item` calls `add_active_effect(..., true)`, so medicine skill XP is deliberately skipped. The contextual operation stages only this one existing native effect; it awards no skill XP or other consumable payout.

`stageContextualBalmEffectRequest(before, plan, context)` appends a request only when the exact command's durable completion count increased by one and the paired version/knowledge receipt timestamp is newer than the input state. It includes the current preexisting effect and remaining duration computed at the completed plan clock, plus exact `completedAt`, `remainingNewDuration`, and receipt cause/time. Repeated preflight for the same cause and timestamp returns the existing staged request unchanged. The root native adapter must validate the request against the command, live/saved template, staged effect decay and envelope; apply `effectiveDuration = max(expectedExistingDuration, remainingNewDuration)` to the copied envelope; validate the entire envelope; store it; then publish the prepared effect. Failed persistence must publish nothing.

## Refreshed read inputs

Full-file SHA-256 input fingerprints, refreshed against the current checkout:

| Input | SHA-256 |
| --- | --- |
| `PROJECT.md` | `c423406d32dca87b4f2c5931f5a2237f9cecfc600b69a3e9efd27836783f9f1e` |
| `AGENTS.md` | `c04b7d937f1dbd753fd07e7ce441f59a851dc5652d94d42e230df2cb7bb5c957` |
| `src/body_progression.js` | `47e8de67bdb099fb41365afafbf3081e342e734d97615850f921e0b280dfe84e` |
| `src/crafting_recipes.js` | `d5e6d381563bdf61dd212291db6bfabf0a4d1c8a56a0b3dd6dcd2e1d898f999d` |
| `src/items.js` | `10b02fdcf0d07e75fb906d06b177b4782a4c05fd4e32fd3d83610c00c2684f71` |
| `src/active_effects.js` | `f189344314508739f54d697e66d383e907d09a9c00948a2e3981337babd9ec7a` |
| `src/main.js` | `d158aeaa4ce4d6a66e95d3aeae5089eb0b48b5758985f095126442da44fe6c2` |
| `src/expansion_persistence.js` | `779a82715884c48f3d2338816d76b90e5e894b625f2fb7daec174091c73bc966` |
| `src/native_gameplay_adapter.js` | `19084b2e8e3b2eeefbac13404b4cfa6ed6619c3e9fb96ad1fb2b10a0ae8bf6c2` |
| `src/simulation.js` | `bcdd2e8ef7efba11b04c3bd164d8eccda1038566021dcbbed4dba93ee8d4d329` |
| `src/gameplay_publication.js` | `4f81c5c65c9496943e68f35e0eed11b5472e2ae34fce5f7fa3f16a293fe6e5c1` |
| `docs/research/amazing-cultivation-simulator/IMPLEMENTATION_PACKETS.md` | `582699dfe6988a70bded50599283abcbd9a346bf66702b8939f0bd4d0d2a1014` |
| `docs/research/amazing-cultivation-simulator/PACKETS.json` | `f628fc5a04a6f5ba394eb22cbd05265db615bd5c016f2db198818a2345c58080` |
| `docs/gm/audit-absorption-2026-10-07/ASSIGNMENT.md` | `fd10b2f7fe252c523d14d6ae5592814450795f4e3c8a22c81317149b01a431b8` |

The packet's historical `main.js`, `items.js`, and `simulation.js` full-file hashes differ from live versions; their cited symbols were re-read and the current effect/item/save shapes were refreshed here. Root integration changed `src/main.js` during this leaf follow-up; the table records the refreshed current hash, without claiming ownership of or editing that shared file. The Healing balm recipe full-file fingerprint still matches the packet.

## Checks and later acceptance

Allowed leaf checks completed: `node --check` on all three modules and a cold import of `contextual_balm_host.js` exposing the complete interface. No gameplay, unit/fixture, browser, save, save-failure, regression, director, or build check was run. This feature remains implemented-unverified and is not yet in the playable bundle.

Later root-owned synthetic and playable gate: with an actually owned balm and current scrape in Village/Shack, compare this choice with free `body.recover`; complete it and verify exactly one item spent, the scrape removed, and the Weak healing balm effect starts at 90 minutes at its receipt time then decays through any joined advance, unless its same-key remaining duration is already longer. Verify sore hands/marks/grip/injury records remain. Show that existing packing/bench work admits the improved hands state where its real gate allows it. Repeat with a current scrape plus soreness, and with a longer same-key effect and a distinct stronger medicine effect. Verify no scrape, no carried balm, borrowed/equipped balm, wrong place, unsupported body, busy work, natural expiry, cancellation and lost completion support. Finally verify failed publisher/save leaves the exact reserved item/effect/conditions unpublished, successful reload retains one receipt/effect without duplication, and ordinary use/rest behavior remains.

Leaf source fingerprints at release:

| Leaf output | SHA-256 |
| --- | --- |
| `src/contextual_balm_content.js` | `41f9d95c7ef9ec1811e8da60ad86ae9822dd24841ccf51e8b7e047f2d9deb26e` |
| `src/contextual_balm_facts.js` | `71404f22b0ed492433b4b0d17798af737d4eb5da2600efa9efe55e22299b1776` |
| `src/contextual_balm_host.js` | `4b63298dea287c8cbba599a2a18ad1875c1bd9d04cbf77bb170e48ab7893515e` |
