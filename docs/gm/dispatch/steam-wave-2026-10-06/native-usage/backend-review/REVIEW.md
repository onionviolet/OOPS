# Factorio ARM backend repair review

Read-only review, 2026-10-07. No Ghidra, native decompiler, debugger, game or recovered-code process was launched. No native corpus, tools, runtime, installed files or saves were changed. The only writes are this review and its evidence metadata. `/root/factorio_native_finish3` retains exclusive native writer authority.

**Concrete next change: qualify all Splitter dispatches in the full retained Program. The current repair qualifies two of fourteen byte-table dispatches.** The resulting preparation gap is verified; its causal role in the native process deaths is not yet proven. For the three unique-hash failures, instrument the exact zero reason before changing the hash scheme. A coherent collision encoding extension and an official symbol-conflict redesign are viable conditional repairs. For forced merge, a specific upstream call-return repair is available only if the failed pair matches its mechanism.

## Verified baseline and failure distinction

The root's [ARM acquisition receipt](../ARM_CORPUS_ACQUISITION.json) reports 183,199 latest unique rows: 183,186 successes, seven decompiler failures and six timeouts. All body bytes and retained decoded instructions were reconciled to the original thin input. These are machine recovery counts, not full semantic reading.

`FULL_CONTEXT_OPTION_PROBE.json` retains thirty diagnostic attempts, five variants for each of six functions. Changing predicate/double-precision, read-only/constant-pointer, unreachable or structure/array/pointer splitting options leaves every failure unchanged:

| Function entry | Error | Probe elapsed range |
|---|---|---|
| `10095b968` Splitter closeUnusedConnections | Native process died | 692–742 ms |
| `10095bc4c` Splitter drawBase | Native process died | 552–598 ms |
| `100a4edf4` BitmapUtil copyBGRAtoRGBA | Unique hash unavailable | 243–255 ms |
| `1026c65c0` stbi TGA load | Unique hash unavailable | 706–728 ms |
| `1026cc9f8` stbi convert format | Unique hash unavailable | 354–373 ms |
| `100aaf468` renderTileVariations | Forced merge intersection | 379–402 ms |

The exact native death cause is **unknown**. Bundled `DecompileProcess.java:196–227,246–264` emits “Decompiler process died” when reading EOF from its response pipe. It supplies no signal or native stack. No matching `decompile` crash report was found in the local DiagnosticReports filename inventory. `ghidra_process.cc:146–154` catches ordinary RecovError/LowlevelError and sends them through the protocol, which explains why the hash and intersection failures differ from EOF. The retained GLAD SIGTERM resource stop is separate and does not diagnose the tiny Splitters.

## Confirmed Splitter preparation gap

`FactorioFullContextRepair.java:24–29,34–35` widens each body to the adjacent callable start, reads four actual table bytes, adds COMPUTED_JUMP references and follows only its supplied first dispatch. Latest chunk 1849 still has unresolved `BR x13` at `10095ba00` and `BR x10` at `10095be88`, immediately after the first decoded cases. Its two rows retain 740/2,552 raw body bytes but only 50/155 decoded instructions.

Read-only LC_SEGMENT_64 mapping of the retained `input/factorio-arm64.macho.gz`, combined with ADR/ADRP/ADD/BR instruction-bit extraction, finds these table patterns. The first two match the previously qualified assembly and table bytes exactly. Remaining patterns and table bytes come from the original thin executable, not mini-program memory:

| Function | Computed branch | ADR base | Global byte table | First four table bytes |
|---|---|---|---|---|
| closeUnused | `10095b9a8` | `10095b9ac` | `10296d25d` | 5,0,2,4 |
| closeUnused | `10095ba00` | `10095ba04` | `10296d261` | 5,0,2,4 |
| closeUnused | `10095ba58` | `10095ba5c` | `10296d265` | 5,0,2,4 |
| closeUnused | `10095baac` | `10095bab0` | `10296d269` | 5,0,2,4 |
| closeUnused | `10095baf4` | `10095baf8` | `10296d26d` | 5,0,2,4 |
| closeUnused | `10095bb38` | `10095bb3c` | `10296d271` | 5,0,2,4 |
| closeUnused | `10095bb7c` | `10095bb80` | `10296d275` | 5,0,2,4 |
| closeUnused | `10095bbbc` | `10095bbc0` | `10296d279` | 1,0,4,8 |
| drawBase | `10095bdb4` | `10095bdb8` | `10296d27d` | 5,0,4,21 |
| drawBase | `10095be88` | `10095be8c` | `10296d281` | 5,0,4,21 |
| drawBase | `10095bf60` | `10095bf64` | `10296d285` | 5,0,4,22 |
| drawBase | `10095c028` | `10095c02c` | `10296d289` | 5,0,4,22 |
| drawBase | `10095c444` | `10095c448` | `10296d291` | 0,22,25,28 |
| drawBase | `10095c490` | `10095c494` | `10296d28d` | 0,54,56,58 |

Target arithmetic is `ADR base + 4 * unsigned table byte`. For example the second closeUnused table yields `10095ba18,10095ba04,10095ba0c,10095ba14`. All listed first-four targets fall within the existing candidate body ranges. Before writing overrides, the sole writer must still decode and qualify every index guard and reachable case in the retained Program. The last two draw guards are present in raw bytes: `10095c418/41c/420` and `10095c464/468/46c` mask the same index byte, compare to three and branch on unsigned greater-than. Raw instruction-bit extraction is preparation evidence, not a newly decoded Ghidra listing or proof of C semantics.

There is a second API gap: COMPUTED_JUMP references are not explicit decompiler switch overrides. Bundled `InstructionPcodeOverride.java:55–74,98–115` considers primary override reference types; `HighFunction.java:168–194` imports dedicated jump-table override namespaces; `JumpTable.java:320–341,350–375` writes/reads the switch and case labels. A transient `new JumpTable(branch, actualDestinations, true, EquateSymbol.FORMAT_DEFAULT).writeOverride(function)` uses this dedicated path (`JumpTable.java:121–134`). Confirm the override appears in the native debug input before attributing an unchanged failure to the backend. Preserve table memory, assert-callee no-return status, adjacent boundaries and full caller/global context. Follow all reachable cases, leaving padding/unreachable candidate bytes honestly classified.

## Unique hash: identity-preserving repair choices

The automatic C++ decompile-path call to `buildDynamicSymbol` is `handleSymbolConflict`, `funcdata_varnode.cc:1028–1059`; it distinguishes HighVariables sharing symbol storage. `buildDynamicSymbol:1314–1335` calls uniqueHash and throws at 1328 when the returned hash is zero. `dynamic.cc` has three distinguishable zero causes: no non-skipped op edges at 331–335/438, no collision group of at most eight at 433–463, or original root absent from the selected candidates at 465–472. The current logs do not identify which applies.

Instrumentation should retain the function entry, root creation index, actual storage/size/flags, defining op sequence address/time/order, every descendant op/slot and both conflicting HighVariable member sets. For each method 0–3, log its hash/address, candidate identities, matching collision count, root membership and chosen champion. Use `Varnode::getCreateIndex/printRaw/printInfo/printCover` from `varnode.hh:201,215–218`; creation indices identify objects within that run and must not become persisted substitute hashes. Use stderr or a separate diagnostic file, never stdout, because stdout carries the native protocol.

The small suggestion in [issue 8467](https://github.com/NationalSecurityAgency/ghidra/issues/8467#issuecomment-3666945747) raises maxduplicates from eight to sixteen. [Issue 9406](https://github.com/NationalSecurityAgency/ghidra/issues/9406) reports that it avoids a hash failure in another architecture. **That one-line change is insufficient for faithful mapping**: C++ `dynamic.cc:474–475,545–546` stores three position bits at 49–51 and three count-minus-one bits at 52–54; readers 737–750 mask three bits. Position eight spills into the count field. The Java counterpart duplicates this scheme at `DynamicHash.java:440,502–503,514,565–566,788–805`.

If instrumentation proves a collision-limit failure, a bounded private variant can retain the old low bits and use currently unused bits 55 and 56 for the fourth position and count bits. It must update both native encoders, both readers and clearTotalPosition, and the Java equivalents for any syntax-tree/dynamic-symbol consumer. Old hashes with those bits zero keep their decoding. A private extended hash must not be written into a canonical Program that stock Ghidra will later read.

Also bind the champion list, method/hash and address as one tuple. Current loops retain the best list while `tmphash/tmpaddr` continue changing for later methods (`dynamic.cc:435–476,503–547`; Java 475–504,538–567). This is a source-visible consistency risk, not an observed cause of these three failures. After encoding, require `findVarnode(fd,address,hash) == originalRoot`, and verify every collision member maps to itself with a distinct pair. Test this before attaching a symbol. Root-absent or no-edge failures require their own actual graph/candidate repair; increasing the limit does not resolve them.

A stronger official alternative is [GP-7063, commit 6740b8992610b38d0983edccb7f04ae769429046](https://github.com/NationalSecurityAgency/ghidra/commit/6740b8992610b38d0983edccb7f04ae769429046). Its `funcdata_varnode.cc:1145–1177,1208–1239` detects true storage/definition conflicts and attaches a `MapEntryConflict` directly to the actual Varnode. `database.cc:1835–1846` creates that entry. This replaces the dynamic-hash conflict fallback while preserving distinct variable objects. It is a 25-file source/data-model/Java-consumer change, not a drop-in edit to the throw. Its suitability is conditional on confirming the same symbol-conflict path and dependencies in this input. Attaching the conflicting variables to one ordinary storage symbol, inventing a zero/default hash or using pointer/creation-index hashes would erase or destabilize identities.

## Forced merge: a concrete official-derived repair

Bundled `merge.cc:301–315` fails after the required address-tied merge, whose intersections were supposed to have been snipped by `unifyAddress:581–600` and `mergeAddrTied:609–634`. Log both failed HighVariable member lists, covers and all defining/effect ops before the throw; `variable.hh:188–190` provides printCover/printInfo. Log the inputs and result of `findPreexistingWhole` at `fspec.cc:5750–5759,5822–5844` and whether its whole Varnode is address-tied.

[Issue 9700](https://github.com/NationalSecurityAgency/ghidra/issues/9700) documents an exact CALL-output/INDIRECT overlap caused by reusing an address-tied whole for a multi-register return. The bundled source still permits that reuse. [Official GP-7136, bb33bad1960a69cf144653d31676a89367d7c608](https://github.com/NationalSecurityAgency/ghidra/commit/bb33bad1960a69cf144653d31676a89367d7c608) removes the reuse in `fspec.cc:5737–5803`, creates a fresh joined return and moves real register outputs into SUBPIECEs. The official commit was committed September 23 after the September 21 bundled release; its old author date does not establish inclusion. The change has 58 files and the issue's maintainer says it was too large for 12.2. It is absent from this bundled 12.1.4 file.

If renderTileVariations has that exact pair, a smaller faithful backport can reject reuse only when the preexisting whole is address-tied and follow the **already existing** fresh-join/SUBPIECE branch at bundled `fspec.cc:5823–5840`. That preserves the original address-tied stack object and its old-value flow while giving the returned register aggregate a distinct value. It must retain word ordering, return sizes and every existing use. Do not apply it merely because an error string matches. If the pair is two INDIRECTs around a transformed heap sequence, [issue 8651](https://github.com/NationalSecurityAgency/ghidra/issues/8651) was fixed by [9460c49a71294041667a4128764788e73d0f5890](https://github.com/NationalSecurityAgency/ghidra/commit/9460c49a71294041667a4128764788e73d0f5890); the bundled dedup path is already present at `constseq.hh:88–112` and `constseq.cc:827–874,933`, so copying that patch again would not be a changed repair. Skipping the required merge or deleting an INDIRECT is not equivalent.

## Finite probe and acceptance gate

1. With the sole native lease free, qualify all fourteen Splitter guards/tables/cases, use dedicated transient overrides, decode reachable gaps and retain a full-context debug input. Compare those byte/flow repairs to the old attempt independently of any backend variant.
2. Replay one hash failure, tilevariation and one Splitter with the baseline backend under the same full Program. `DecompInterface.enableDebug(File):187–189` captures the native input; a debugger or instrumented private backend must retain actual exit status/signal and stack. A standalone debug replay qualifies only if it reproduces the full-context failure and includes the needed memory/prototypes/overrides. Minimal global-free successes remain diagnostic.
3. For each hash zero reason, use the smallest corresponding coherent mapping repair. Retain graph fingerprints before naming and exact original-root/member roundtrips afterward. For the call-return overlap, select the guarded fresh-join repair only after matching its failing pair. Preserve the original failures when a mechanism does not match.
4. Keep the action pipeline at `decompile` for qualifying C. `coreaction.cc:5475–5507` shows normalize/firstpass omit required merge/naming work; `ghidra_process.cc:328–330` emits C only for the decompile action. Those pipelines may locate a failing stage, but their completed status does not recover a C body. Do not retry unchanged deterministic errors with longer timeouts.
5. Qualify actual full-context C, raw-byte/body hashes, all reachable instructions, table case targets, input/return physical storage, side effects, direct/indirect calls and variable ownership. For bitmap retain channel swap/premultiply/stride behavior; for stbi retain all formats/allocation/size/error paths; for Splitters retain every connection/draw branch and assert path; for tilevariation retain branch-dependent old stack values and real aggregate return flow. Retain warnings and unresolved indirect targets explicitly. Export canonical complete rows with variant hashes only after these checks, then reconcile the corpus. This review itself changes no success count.

Source paths and exact file hashes are in [EVIDENCE.json](EVIDENCE.json). No implementation, rebuilt variant, full-context probe, crash diagnosis or changed C recovery is claimed here.
