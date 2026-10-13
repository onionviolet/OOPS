# Bounded route integration source review

Status: RS-F1 and RS-F2 repaired at source on revision 2 inputs; native qualification belongs to the integrator. RS-F3 is also repaired at source on revision 3 inputs. Source-only review; no build, browser, broad suite, save import or runtime mutation. This is not the final whole-world gap review. Exact reviewed source inputs: ROUTE_SOURCE_FINGERPRINTS.json. Private qualification inputs remain ignored.

## RS-F1 (P2): Optional wear does not enroll structured equipped items

Structured equipment effects use authored canonical keys (`simulation_effects.js:328`); publication decodes those keys directly (`native_equipment_transaction.js:13`). Neither path calls `durability.prepareEquip`. Actual landed-hit wear ignores keys without an instance identity (`absorb_e2/durability.js:97`). Therefore enabling optional wear before acquiring and equipping a structured borrowed unit leaves that unit outside actual wear. Attempting to activate wear after equipping the loan is blocked by the disposition guard in `stageToggle` instead of enrolling it.

The canonical authorization and save-conservation repair is present and should be retained. Once an identified unit is admitted or restored, an adjacent conditional defect remains: native unequip grants the identified exact key, while authored canonical re-equip/return effects debit the canonical key. Exact debit matching rejects that stock. A narrow pure acquisition diagnostic confirmed the key mismatch, but does not prove a native journey. An initial full effects diagnostic used an incomplete synthetic state and failed before reaching the behavior; it is not evidence of a product defect.

Repair gate: actual enabled-wear acquisition/equip, landed hit, unequip/re-equip and legitimate return must conserve the same unit and custody across save/reload/import. Resolve one actual owned key with duplicate safeguards; do not discard instance identity or weaken loan protection.

## RS-F2 (P2): Native unequip and wear do not refresh structured defense immediately

Structured defense is stored through Hero.addActiveEffectBonus in the active-effect stats cache (`models/hero.js:101`). Native unequip (`main.js:4370`, `models/hero.js:313`) recalculates equipment and stats without repopulating that cache. Actual landed-hit wear similarly calls only `_equipItem(null)` (`models/combat.js:369`, `models/person.js:496`). The structured projection itself can change, while native full stats continue using the previous active-effect value until `refreshStatusCareStats` runs through a persisted update or restore.

Native unequip is a reachable path for a worn structured loan. Repair gate: read the actual native defense getter synchronously immediately after native unequip and actual wear, before the next clock publication. The value must reflect current slots and condition. Helper projection output alone cannot qualify this gate.

## Reviewed joins and limits

- RS-V1: Timed relocation forwards nativeLocation and nativePatch from advanceSimulation; persistence publishes native location after durable save. Frozen job context retains identity/party only, so current host body/support is not replaced by a stale start-time body snapshot.
- RS-V2: Unit conservation includes native worn keys after canonicalizing optional wear identity and still counts duplicates. Deferred unit admission and declared title recipients retain one-unit conservation. Exact old-content restore remains pinned to revision, content hash, start snapshot and complete unit/container bindings; no automatic replacement by a newer pack was found.
- RS-V3: Target provider/body/fuel facts are execution predicates. Rejection uses generic authored reasons; no new direct hidden build disclosure was found in the inspected projection path. This is a bounded source conclusion, not exhaustive disclosure or native compatibility acceptance.

Root owns native checks and repairs. Review findings do not close any full-world parent family or imply director acceptance.

## Revision 2 repair dispositions

RS-F1: SOURCE-REPAIRED, NATIVE-PENDING. `main.persistExpansion` stages a separate durability ledger using planned wear-state precedence, enrolls structured equipped items before save, writes both identity and ledger atomically, and loads the staged ledger only after persistence. Actual identified keys survive structured restore. `resolveSimulationInventoryKey` resolves unique aliases while retaining exact keys, and preview freezes resolved debit keys for cancellation. Canonical return matching retains owner/holder/count checks. This closes the original source paths; root must qualify actual wear, return and persistence.

RS-F2: SOURCE-REPAIRED, NATIVE-PENDING. Hero.addAllEquipmentBonus refreshes current simulation effect cache before native stat recomputation. Actual `_equipItem(null)`, native unequip and landed-hit wear all reach this override. It checks the reader before calling it, preserving early startup without a reader. No recursive call through addActiveEffectBonus was found.

RS-F3 (P2): Non-returning custody protection still compares the raw key. `simulation_effects.js:187` resolves transfer/custody effects to the identified actual inventory key, but `:259` rejects another claimant only when `c.key === e.key`. A canonical loan record and identified actual copy no longer compare equal, so a non-returning transfer can pass this guard. The consumption and legitimate-return guards already canonicalize. Apply the same identity comparison to the non-returning guard and retain holder/explicit-policy checks. This is a concrete generic guard regression; no current private sale-of-loan player route was asserted or exercised.

RS-V4: Actor inventory predicates now expose canonical aggregate aliases; target inventory predicates still expose exact keys only. Current reviewed target-item predicates concern non-equipment stock, so no concrete current-unit failure was found. Future predicates for identified target equipment must share alias handling, or deliberately select exact identity. No new target-build UI disclosure was found.

Revision 2 checks were read-only source inspection. No tests, build, browser or saves were run. Earlier diagnostic scope remains as stated above. Exact prior and current source hashes are retained in the fingerprint file.

## Revision 3 final source disposition and release

RS-F3: SOURCE-REPAIRED. Reread `simulation_effects.js` non-returning transfer/custody protection: it now compares canonicalDurabilityKey(c.key) with canonicalDurabilityKey(e.key), retaining the exact holder and explicit returning/breakCustody policy checks. Legitimate return retains owner/holder/count validation. All three review findings are source-repaired. Source fingerprints refreshed; prior revisions retained.

No additional suites or native checks were run by this reviewer. Root owns the final rebuilt native enrollment, wear, immediate stats, return and persistence qualification. This bounded source reviewer has completed the assignment and releases the reserved review files.
