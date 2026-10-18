# Continued consumers, emergence and cleanup research

2026-10-15. Research-only continuation of the [saved workflow](../WORKFLOW.md). No YAIR gameplay/design implementation, game launch or personal save was authorized or performed. Sources remain version-pinned; full raw material, disassembly, pseudocode and exact ledgers remain private/local.

## Results

| Code | Lane | Concrete progress | Still open |
|---|---|---|---|
| F16-F18 | [Qud depth4](../../qud-systems-audit-2026-10-15/depth-4/REPORT.md) | Final forcefield passage and stasis support, ordinary destruction teardown, opinion expiry, terrain-dependent fall damage, teleport/burrowing, mine payload and vortex transport | All removal listeners, no-context/graveyard/save cleanup, power-source refunds, phase-projectile expiry, vortex queued-victim retention and native reproduction |
| RW2-F1-F4 | [Rain World audit](../../rain-world/emergence-2026-10-15/round-2/audit/REPORT.md) | Ghost propagation, flee search/path legality, actual managed rain danger, serialized grip reconstruction and bilateral cleanup | Whole-grid planning/update order, native engine internals, unusual graph cycles, load retries, complete species/config coverage and native encounters |
| DF-EMR2-05-06 | [DF native audit](../../dwarf-fortress/emergence-2026-10-15/round-2/audit/NATIVE_AUDIT.md) | RTTI-linked native injury mutations and an actual cancellation/unlink chain, independently checked with instruction decoding | Tick/expiry dispatcher, source loss, full anatomy structures, universal cancellation/refund, virtual-destructor effects and persistence |

## What changed in our understanding

**C1: Qud fields are maintained relationships.** Stasis requires a matching field in the same cell, and field destruction explicitly checks for another remaining supplier. Nullifier affects both stasis eligibility and forcefield passage. Falling after flight loss depends on terrain and CanFall; the pull-down consumer then handles relocation, collision damage, major fall damage and companion separation. Timed mines explicitly pause their timer in stasis. A vortex can defer ordinary victims as contextless queued objects while important actors force destination resolution; its queue serialization/expiry path is a newly named cleanup question.

**C2: Rain World does not enforce an absolute observation-only AI boundary.** Ghost hypotheses use real target-room state in one helper. They remain a useful uncertain-tracking system, but the earlier broad interpretation needed that correction. Fleeing is budgeted search followed by separate path legality and body movement. Rain exposure has a concrete managed accumulation/death route. A separate ground-slam contribution is zero for ordinary finite admitted speeds under the captured formula; IL and the installed math implementation confirm the sign/branch analysis. That is a static finding, not a reproduced weather bug, and it does not remove the independent rain-danger route.

**C3: Dwarf Fortress now has selected native consumers, beyond declarations.** MSVC RTTI and vtable pointers identify three effect-class methods; PE unwind ranges and independent instruction decoding verify their bodies. One clears a selected infection-related bit, one reduces a positive bleeding-related counter with a signed percentage formula and clamp, and one synchronously removes tissue-related entries and clears flags under different selector/threshold rules. Those semantic labels are supported by the RTTI class context; the exact native structures and clinical meaning of every field remain unknown.

The cancellation chain clears an owner pointer, removes bilateral associations and may unlink/free a record. Some branches retain/requeue it. This is real cleanup, but it does not establish ingredient refunds, atomic rollback or every reaction's cancellation policy. Existing save/load diagnostic routines were also rechecked and are kept separate from gameplay cleanup. Raw strings, function identity, concrete state writes and full dispatch behavior are now distinct evidence levels.

## Coverage stays explicit

| Lane | Current ledger | Count qualification |
|---|---|---|
| Qud | [UNREAD](../../qud-systems-audit-2026-10-15/private/depth-4/UNREAD.json) | 440 unique captured types across depth exports;235 absent from depth1-4 print ledgers. This round prints20types,18new to those ledgers. Print coverage is not whole-class semantic review. |
| Rain World | [Cumulative audit ledger](../../rain-world/emergence-2026-10-15/round-2/audit/READ_LEDGER.json) and [unread](../../rain-world/emergence-2026-10-15/round-2/audit/UNREAD.json) | Audit:40unique game classes,8fully read,19selected-window read,13captured-unread. Extraction has its own41-type ledger; alias/support and reading coverage differ, so counts are not summed. |
| Dwarf Fortress | [Audit unread](../../dwarf-fortress/emergence-2026-10-15/round-2/audit/UNREAD.json) and [extraction](../../dwarf-fortress/emergence-2026-10-15/round-2/extraction/REPORT.md) | Original393readable files retain cumulative span accounting. Native regions, helper bodies and unvisited callers have separate coverage; a recovered virtual method does not mark the class/engine read. |

All lane artifact validations and [integration validation](VALIDATION.json) are research-integrity checks. No physical outcome, installed-runtime behavior, save roundtrip, human acceptance, commit, push or publication is claimed.
