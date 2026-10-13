# Bounded independent integration review

2026-10-11. Reviewed top-level DESIGN.md, SYSTEMS_MAP.md, DETAIL_LEDGER.json and
PACKETS.md only. Review is planning/source qualification, not runtime proof.
Only this review file is owned by the reviewer. Parent owns corrections.

## Actionable defects at review snapshot

**R1: Chance bridge variant loses its supporting contract.** DESIGN's
`SC03.V03` explicitly uses observation or committed chance. The ledger maps it
to `SC03.02` but that leaf covers institution/body access only, dependencies are
SS02/03/08, and persistence/cases cover credentials and installed sources. Add
variant-specific SS05/SS06 dependencies, acquisition/attempt/outcome receipt
policy, and discovery/chance tests; retain SC03.V03 rather than merging its
requirements into an unexplained credential.

**R2: Cross-power cache interactions lose identity and information requirements.**
`SC06.V05` promises inspection, container copying and scoped restoration/rerolls.
Its destination `SC06.03` has SS01/07/10/11 but no SS02/05/06 and tests only
ordinary opening/no-duplication/source support. Add conditional carrier/copy
identity, observation reach, scoped RNG/restore and outside-retention cases.
A box-opening test alone cannot certify these distinct interactions.

**R3: Creation lifecycle variant lacks its clock/persistence gates.**
`SC08.V06` maps to `SC08.03`, whose dependencies exclude SS04/SS11 and whose
cases concern creator knowledge, process editing and unsupported scale. Add
variant-specific departure/return, declared clock, active visitor deletion
rejection/relocation, exact cargo/export identity and save/reload/import cases.
Autonomous inhabitants and creation rights do not prove deletion or transfer.

**R4: P03's alternatives have a shared incompatible acceptance clause.**
P03 permits a fixed-preservation mechanism *or* a lens bridge and explicitly
keeps their requirements distinct. Its acceptance paragraph still unconditionally
requires “same fixed cheat revision across two distinct uses.” Make that
criterion conditional on fixed-function selection; for lens-only select actual
before/after extraordinary inspection plus retained ordinary usefulness instead.
Otherwise a coherent lens-only slice cannot satisfy its declared packet.

## Checks and bounded conclusions

- SC01–SC10 have substantive early/middle/later treatment and concrete decisions.
- Ledger parses; 36 integrated requirement IDs and 59 design-variant IDs are
  unique. Every variant destination exists. This checks structure, not the
  completeness of its inherited contract, which R1–R3 address.
- SYSTEMS_MAP preserves source-only versus partial/new-adapter/new-service
  boundaries, affected native Math.random consumers, fixed read-only quest cards,
  specialized UI exclusions and missing arbitrary-world bindings. No material
  source/API runtime overclaim found in this bounded pass.
- Packet order supplies an existing-entry connected System option, excludes an
  engine rewrite prerequisite, and leaves runtime dispatch/selection separate.
  Declared fresh-origin/build, natural pacing, compatibility and save/reload/import
  gates are specified, not passed. Human fiction/balance acceptance stays open.
- Local links from DESIGN/SYSTEMS_MAP/PACKETS resolve except REPORT.md, which was
  still being compiled by the parent at this snapshot. Recheck after publication.

Parent was notified of R1–R4 before report compilation finished. This file records
the review snapshot; parent may annotate correction status or request recheck.

## Repair readback: R1–R4 resolved

Read back the parent-saved ledger and packet corrections on 2026-10-11:

- R1 resolved: SC03.02 now includes SS05/SS06, observed basis and committed
  acquisition outcome/attempt persistence, plus T4 clue-without-source and T5
  exact committed acquisition cases.
- R2 resolved: SC06.03 now includes SS02/SS05/SS06, copied-instance versus fresh
  draw, appraisal and rollback/external-retention policy, plus T4 fixed-content
  copy and T5 exact container/outside-reward restore cases.
- R3 resolved: SC08.03 now includes SS04/SS11, active visitor/resident/cargo
  resolution and retained export/clock policy, plus T4 active-visitor deletion
  and T5 exact cargo/clock export-return-save-import cases.
- R4 resolved: P03 now explicitly requires unchanged revision/two uses only
  for fixed-function selection; lens-only proves ordinary construction and newly
  supported inspection without requiring a cheat.

Ledger now contains 114 specified-not-run cases. REPORT.md exists on readback,
closing the temporary missing-link condition. All four actionable review defects
are resolved as planning contracts. Runtime, source-fidelity for selected future
content and human selection/acceptance remain open; none was exercised here.
