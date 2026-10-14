# T2 chain inspector

## Stage 1: live audit, before code

F1: Clean branch proc/cb-t2-inspector starts at 4f853c24, the merged HV1 source. PC1-P2/P16 and PC4-H1 through H5 still describe the live shapes. HV2 M1 is a semantic role mapping, not a new schema. Its MODEL is absent in this base worktree; read the explicitly requested main-checkout document without writing there.

F2: HV1 retains schema/revision 1, FIFO specimen arrays, one job, and the latest receipt only. Species priority is the HARVEST_SPECIES list, with no rotation. Ordinary automatic jobs advance alongside combat but pause for activity, action, dialogue, sleep, reading, trade and native occupation. An explicit job owns the player. One advance settles at most one job, then admits another without applying surplus time. The per-species cap of 24 includes the active specimen. Incoming overflow auto-processes whole immediately when enabled, otherwise increments left. Taking one part discards the rest. Grade uses settlement clock, skill and tool; inventory keys retain quality/completeness but no per-copy provenance or freshness history.

F3: P2 retains ingredient profiles, product truth, independent observed knowledge, learned methods and one repeat job with held inputs. Mixing is immediate; repeat reserves one batch, takes three played minutes, then attempts the next admission from current stock. Product keys are recipe/composition identities, not physical vial lineage. Feature objects already use native keyed stock plus simulation jobs/sites/custody/knowledge. Cut produces wet staves, drying produces sound staves, matching produces a fitting insert, and kits consume sound staves plus sap. Matching is a branch, not a prerequisite for kits.

D1: Reuse the existing Developer harvest inputs disclosure (src/harvest_ui.js), rename it Developer chain inspector and retain its existing explicit developer gate: exact dev-release URL or ?harvest-inspector=1. The query flag is an explicit debug opt-in, never an in-fiction lens. Move the disclosure next to the harvest panel so it can show mixtures before the first kill and while the harvest owner is absent. No new screen or saved preference. Developer labels warn that retained truth is visible. Every non-developer projection returns no rows, IDs, counts or traces.

D2: Target desktop 1366x768 and 1600x1000 with wrapping role rows and one bounded scrolling disclosure. No mutation controls inside it. Read only existing owners and receipt fields; never enroll, initialize absent domains, resolve mixtures, sample randomness or recompute a rule. T3 gets an optional resolver-produced trace input, absent until supplied. No save changes or migration: absent owners stay absent and existing saves keep exactly their current contract.

## Verification

Pending stages 2 through 4. Source audit only so far.

## Stage 2: pure readers

F4: Added src/chain_inspector.js. Source rows read retained lots/profiles/native stock and custody; part-template rows read authored part/command definitions; operation rows read current jobs/methods and current scheduler eligibility; output-batch rows distinguish current keyed stock from latest receipt output; observation rows read existing harvest/knowledge receipts. No physical lineage is invented. Why text identifies existing policy or quotes caused knowledge. Feature templates are definitions, not recomputed eligibility or rule traces.

F5: Six focused SOURCE tests pass: deterministic frozen inputs, byte equality, identical harvest/mixture quotes, identical next loot/craft/gather draws and stream receipts, absent-owner non-initialization, fail-closed non-developer access, and verbatim supplied-trace display. The public view entry is projectChains(frame, {developer:true}); only that explicit boolean enables truth. Domain readers are internal developer adapters, not in-fiction views. T3 supplies ruleTrace as a transient frame property; absent traces stay absent and no resolver is imported.
