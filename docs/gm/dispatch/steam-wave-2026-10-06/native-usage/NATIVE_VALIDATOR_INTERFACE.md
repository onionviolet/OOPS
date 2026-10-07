# Retort native-envelope validator

`validateFactorioRetortNativeEnvelope(save)` in [factorio_retort_native.js](../../../../../src/factorio_retort_native.js) is a pure full-save reader. It returns `true` or throws before publication/load mutation. Root calls it from `validateSaveEnvelope` after general expansion validation. It never installs a rack, creates stock, advances time, rewrites a save or publishes an output. This original additive implementation is **implemented-unverified**; no gameplay acceptance is claimed.

Writer `/root/oxygen_gm` owns only that source leaf and this interface. Book GM owns content/facts/host; root owns registry, save reader, scheduler, native item registration, publication, UI and build. [The integration scout](ENGINE_SCOUT.md) and [released book-world checkpoint](../../../book-world-completion-2026-10-06/CHECKPOINT.md) supply the current contract. Private saves are untouched.

## Dependencies and activation

The leaf imports `FACTORIO_RETORT_IDS`, `FACTORIO_RETORT_KEYS`, `FACTORIO_RETORT_TERMS` and `factorioRetortDefinitions` from the content leaf. Host APIs `validateFactorioRetortState(state)` and `validateFactorioRetortAcceptedJob(job,state)` own exact installation/knowledge/counter/cursor and frozen job terms. These use retained definitions when no registry argument is supplied; root's general state validation also checks registered definitions.

Only the five authored plain JSON keys are counted: Empty/Filled resin tray, Empty/Filled residue tray and Spent retort residue. Extra quality/components/metadata, altered JSON encoding, malformed key variants, unsupported counts, equipment and borrowed custody are rejected. Resin output is the existing Set repair resin and is deliberately outside the new conservation equation because other genuine recipes create/spend it.

Missing `state.referenceGameplay.retort` is inert. It cannot coexist with new physical stock, retort jobs/cursors/activation records or rack state. The optional receipt is schema 1 with installed time/sequence, the once completed installation and real player-owned capacity-1 rack. Its retained definition anchors the rack to Village/base.frontier; the player need not remain there forever. Existing clocks, outer save schemas and unrelated state owners are unchanged.

Root resolved the generic seeding gap: declare the rack `provision:false`, validate that optional site field and skip such sites during generic simulation enrollment. The paid installation's ordinary site effect remains its creation path. Existing sites retain default provisioning.

## Actual stock and aliases

Canonical `save.inventories[category][owner]` containers include personal bags, shops and the registered `storage/player` chest. Saved native entries must use `{count}`; simulation-owned inventories use numeric quantities and must belong to actual simulation-inventory people. No synthetic `save.gameplay`, display fact, inventory copy or fictitious actor contributes stock.

Legacy `character.inventory`, `player_storage.inventory` and `traders[id].inventory` name the same player/chest/shop when their canonical containers exist. Their projection of the five retort quantities must match, and it is counted once. If the canonical container is absent, the legacy bag is the actual fallback. An ambiguous shared bag under two unrelated owner labels cannot conceal another receiver.

Negative item costs in actual accepted retort jobs are already removed from bags, so their physical held quantities enter the total. The host reader pins actual job identity, sequence, revision, player/context/participants, rack reservation, costs, paired effects, return flags and completion support. An unrelated job cannot fabricate retort reservations or products. Every rack reservation must point back to the actual accepted retort job. Future positive effects are not current stock.

## Conservation and return policy

Let B/R/C/D/L be the actual player completed batch/resin collection/residue collection/filled disposal/loose disposal counters. Across physical bags, stores, shops, simulation owners and held negative costs:

| Required invariant | Meaning |
| --- | --- |
| Empty resin + Filled resin = 1 | One conserved resin receiver, including a held reservation. |
| Empty residue + Filled residue = 1 | One separately conserved coproduct receiver. |
| Filled resin = B − R | Only actual uncollected batch resin fills its tray. |
| Filled residue = B − C − D | Collection or filled disposal clears exactly that content. |
| Loose residue = C − L | Collected coproduct remains real stock until loose disposal. |

Counts and differences must be nonnegative safe integers. The same completed counter cannot belong to another actor. Moving or selling a full tray changes its holder, not capacity or these global quantities. Only actually carried Empty trays support a new player's batch; stock admission remains the facts/host owner's job.

An unprocessed cancelled/refunded batch restores its exact Empty trays and paid inputs/effort. Completion instead returns changed Filled variants with `reservationReturn:true`; collection/disposal returns the existing Empty variant with that same accounting flag. The validator checks frozen terms and quantities, not a replayed future output or acquisition-log counter. Post-completion variants are never added to bag totals while merely promised by a job.

## Checks and remaining gate

Source syntax, pure import and an absent-receipt envelope passed. Narrow in-memory envelope fixtures are permitted to verify new conservation/alias/corruption branches; their final case receipt is recorded below when complete. They do not instantiate native items, play commands, write storage or prove save/reload, trade, cancellation execution or publisher rollback.

Root must integrate the save call, registration, optional state reader, exact registry/site definitions and supported-job/UI joins, then rebuild. Gameplay/native-constructor/browser/save/reload/import/failure/regression/director acceptance remains deferred. The later journey must prove actual installation, paired output, independent collection/stall, stored/sold tray recovery, separate disposal, cancellation and one durable publisher. The reader has no cryptographic authenticity claim against a fully rewritten consistent save; retained completion counters and exact declared receipts are the existing authoritative history.
