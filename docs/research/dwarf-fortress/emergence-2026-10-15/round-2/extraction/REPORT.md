# Dwarf Fortress round 2: actual native healing and job cleanup

Research only, 2026-10-15. This pass advances beyond raw declarations into identified native effect methods and a connected job-detachment chain. No game code was executed. No YAIRPG implementation or installed-game change occurred.

**DF-N1:** Three RTTI-bound native effect methods mutate actor injury records: cure infection, stop bleeding and heal tissues. Cure and bleeding methods require a concrete primary selector; the tissue-healing method also accepts `-1` as its primary wildcard. Bleeding reduction has a recovered integer formula and zero floor. Tissue healing performs qualified state cleanup and then rebuilds derived injury aggregates.

**DF-N2:** The routine referencing the cancellation message also detaches job/item references, clears actor work state and conditionally destroys or retains a job. A helper removes a matching reverse item reference before removing the job's item entry. This is a real cleanup chain, with branch limits still open; it does not prove recipe-input refunds or atomic cancellation.

**DF-N3:** Ghidra's seeded FunctionManager bodies remained one byte and its assembly/callee lists were empty. Those lists cannot establish whole-function instruction coverage. Independent LLVM disassembly now supplies full selected `.pdata` regions, exact call sites and six literal-reference instructions. The report keeps `.pdata` unwind regions, decompiler-followed code and complete logical functions distinct.

The binary remains build `24557528`, SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`. Image base is `0x140000000`; all addresses in this pass apply only to those bytes.

[Native consumer details](NATIVE_CONSUMERS.md) preserve the formulas, selector rules, branch-dependent cleanup and combinations. [Evidence ladder](EVIDENCE_LADDER.json) records what each candidate reached. [Coverage](COVERAGE.json) lists exact reviewed/unread native source windows and preserves the earlier readable corpus's unread complement. [Tooling](TOOLING.md) records the precise static route and its limits.

Full pseudocode, LLVM assembly, reference windows, PE mappings, RTTI/vtable pointers, REA envelopes and scripts are retained under [the private round-2 archive](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/). These are derived native representations, not original C++ source. Public notes paraphrase and preserve small field/address identifiers.

## What this closes and what remains open

| Named gap | New evidence | Remaining boundary |
| --- | --- | --- |
| Healing actual effect | RTTI→vtable→native methods→actor record writes, numeric bleeding formula, tissue aggregate call | Entry admission, parser mapping of the scale field, complete caller chain and played result |
| Cleanup of healed tissue state | Parallel-array erase, qualified flag/counter clearing, derived aggregates rebuilt | Unnamed bit meanings, wound deletion, scars, all anatomy-loss rules, other effects |
| Job/item reservation cleanup | Cancellation routine→detach helper→reverse-reference and item-entry removal; typed references and conditional destruction | Every branch/job type, refund/rollback, stack reservation policy, concurrency and persistence |
| Effect object destruction | Separate class destructor frees owned vectors and storage | This is not timed syndrome expiry or reversal of actor changes |
| Syndrome expiry/reversal | Still unresolved | No expiry scheduler, overlap restoration, transformation reversion or cure dispatcher identified |

The finished [aspects pass](../../../aspects-2026-10-14/REPORT.md) was inspected first. Its four prior native outputs concern text and save/load error handling. No persistent native project remained in its temporary directory, and its checkpoint said no pending worker. This pass reused the same pinned binary and existing patched REA/Ghidra tools, with focused seeds and automatic analysis disabled. It did not repeat a whole-image analysis or modify the other lane.

[Independent audit](../audit/REPORT.md) owns its own verification scope. Native actor mutation is now source-supported for the selected methods; runtime reachability, NPC decisions, save behavior and human acceptance remain untested.
