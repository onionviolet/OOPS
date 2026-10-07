# Native recovery reader

The input is the installed Factorio2.0.77/build23347942 universal binary, retained privately with exact hashes in [intake](INTAKE.json). Every recovered body is generated C-like output from Ghidra12.1.4. Names retained by the release binary help identify methods; inferred signatures, types, comments, structures and boundaries are not the original C++ project. Do not execute recovered code.

Raw bodies, bytes, disassembly and the lookup database stay outside Git at `/Users/weiwei/.codex/research/factorio/native-23347942/`. The install, saves and entitlements are untouched. [Pipeline](PIPELINE.json) records tool qualification, current sessions and generated-output limits. [Checkpoint](CHECKPOINT.md) owns actual progress; this guide does not claim whole recovery is complete.

The private reader is `recovery_index.py` in that directory. Run it with `python3` and `--arch arm64` or `--arch x86_64`:

1. `update` verifies closed gzip chunk hashes, record counts and C hashes, then adds their current entries to SQLite.
2. `find --name ProductionHelper --limit 30` returns entry addresses, status, chunk/line locators and C hashes. Name search also accepts other class/method fragments.
3. `extract --entry 100012345 --output /absolute/private/output` writes that entry's exact retained JSON record and C-like body privately. The address is illustrative; choose a verified result from `find`.
4. `summary` reports current unique records, classified statuses, thunks, instructions and retained attempts. These are generated-output counts, not semantic reading.
5. `reconcile` compares current records against the complete Ghidra function inventory and the union of nm text entries and LC_FUNCTION_STARTS. The resulting coverage receipt retains every omission and failure.

Each schema2 record includes the current program/architecture, entry aliases and signature source, current body ranges with raw byte pieces/hash, C body/hash, decoded instructions, direct calls/callers, discovered incoming/outgoing references, thunk target, noreturn flag and timed attempt/error history. Reference absence can mean Ghidra has not resolved an indirect target. A function's virtual-table incoming reference and an actual runtime call are different evidence.

The entry union adds71arm64 anonymous LC_FUNCTION_STARTS absent from the nm-only inventory. Both nm inventories classify the Mach-O header at100000000 as text; it is defined header data and rejected as noncallable. Generated function inventory, callable candidates, external library entries and import thunks retain separate denominators.

[Production trace](NATIVE_PRODUCTION_TRACE.md), [early reviewed claims](readers/production-early/REPORT.md) and [source bindings](SOURCE_BINDING.json) qualify the initial38body pass. Later analyzed retries supersede specific bodies by entry/hash while preserving their prior evidence and excluded assertion tails. Base/Space Age/Quality/Elevated Rails source identity comes from the separate installed Lua/DLC inventory, not a native symbol's presence alone. Wider native findings must state whether a claim was actually read, inferred from references, or proposed for YAIR.

The exact bundled Steam API library and original license/attribution text are preserved privately in [dependency retention](DEPENDENCY_RETENTION.json). Main-slice LC dependencies are dispositioned individually. This preserves useful input and attribution; Steam API and OS framework bodies remain external and unrecovered. No library was executed or added to the main both-slice decompilation scope.
