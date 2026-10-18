# Native consumers, formulas and cleanup boundaries

Pinned executable: SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`; PE image base `0x140000000`. Full private outputs are under `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/`. Each `extract/native-0xADDRESS.c` has stable numbered lines; `extract/assembly-0xADDRESS.txt` contains independently decoded instruction addresses and bytes. `notes/function-map.json` records file offsets, selected region sizes, raw-byte hashes and exact LLVM commands. The binary itself is reused read-only from `/Users/weiwei/.codex/research/bf-dwarf-fortress/extract/payload/Dwarf Fortress.exe`.

“Shown” below means recovered native instructions/structure. Names such as injury record, primary selector and job are interpretations connected to RTTI and cancellation context; original C++ field names and all enum meanings were not recovered. Offsets are retained precisely so later evidence can correct those interpretations without losing the observed behavior.

## DF-NC1: Establishing effect identity

MSVC type-name strings identify `creature_interaction_effect_cure_infectionst`, `creature_interaction_effect_stop_bleedingst` and `creature_interaction_effect_heal_tissuesst`. For each, the extractor joins the name to its type descriptor 16 bytes earlier, finds a complete-object locator whose signature is1 and self-RVA matches its file mapping, then finds the pointer preceding a consecutive virtual-method table. All three selected tables have24 consecutive code pointers before a non-code value. This is a structural candidate boundary, not a recovered C++ declaration.

| Class interpretation | Type descriptor VA | COL VA | Vtable VA | Slot3 method | `.pdata` end, exclusive |
| --- | --- | --- | --- | --- | --- |
| Cure infection | `0x1418cfed0` | `0x1417ae070` | `0x1417158a8` | `0x140d7a680` | `0x140d7a9e1` |
| Stop bleeding | `0x1418cfc90` | `0x1417add68` | `0x141716e88` | `0x140d7af40` | `0x140d7b2be` |
| Heal tissues | `0x1418cff20` | `0x1417ae540` | `0x141716dc0` | `0x140d7c330` | `0x140d7c8d2` |

Slot numbers here are zero-based. Slot3 actually performs actor record mutations, rather than merely returning a type ID or serializing a definition. The cure class's slot0 method `0x14028c660` returns `0x2e`; this value is observed but not promoted to a universal externally named enum.

Six raw-literal LEA candidates were independently decoded with LLVM and resolve to the exact expected string VAs. The `CE_*` token references all sit in the large native region `0x140d6c550–0x140d78559`, which remains parser-adjacent rather than semantically reviewed here. Its existence does not close runtime admission or severity-field binding.

## DF-NC2: Cure infection is a qualified bit operation

Source: `native-0x140d7a680.c:55–79`; assembly `0x140d7a6b4–0x140d7a721`.

The actor argument supplies a vector at `+0x5b0/+0x5b8`. Each entry supplies another vector at `+8/+0x10`. For each nested record, the method requires the primary short selector to be other than `-1` and to equal record short `+4`. Record short `+6` must equal the secondary selector unless that selector is `-1`. If record dword `+0x64` contains bit `0x20`, the method clears exactly that bit and records that something changed.

At instruction `0x140d7a6d8`, primary `-1` branches directly past the inner loop. At `0x140d7a6fb`, secondary `-1` is admitted as a wildcard. At `0x140d7a70c–0x140d7a710`, mask `0xffffffdf` is written back. This distinction is native, not guessed from the raw effect name.

After a change, a separate mode/settings gate controls message construction. The method scans a different actor vector for short value `0x47` before adding a corresponding notice and constructing its log text. The state mutation happens before that reporting gate. The selected native body contains no player-only restriction on the injury mutation; only its message path compares with a global actor pointer. The caller may still impose admission restrictions.

**Limits:** The method does not iterate all records when primary selector is `-1`, does not delete the containing wound/vector entry, and does not itself repair anatomy, return missing parts, fill blood or remove a syndrome definition. Bit `0x20` is associated with infection by this RTTI-bound consumer; the complete flag schema is still unknown. Timed expiry and overlapping syndrome removal are separate unresolved paths.

## DF-NC3: Bleeding reduction uses a numeric decrement

Source: `native-0x140d7af40.c:59–84`; assembly `0x140d7af73–0x140d7b005`.

The method computes a decrement from its fifth argument `a` and the effect object's signed dword at `+0x98`, called `s` here. In the ordinary non-overflow range:

`delta = trunc_toward_zero((a * s) / 100) + 1`

The machine first multiplies in32bits. Valid ranges preventing overflow, and the semantic meaning of `a` and `s`, require the caller/parser; they are not established merely by naming the raw token `SEV`. For nonnegative valid products the division is the usual integer floor. The extra1 means a zero product still produces decrement1. Negative or overflowing inputs are not proven admissible, so no gameplay exploit is claimed.

It walks the same nested actor record vectors as cure infection. Primary selector must be concrete and match `record+4`; secondary may be `-1` or match `record+6`. Only positive counters at record dword `+0x6c` are changed. The decrement is subtracted and a negative result is floored to0. There is no upper clamp in this selected operation. The message path uses a separate marker `0x49` and runs only after a record changed and reporting gates allow it.

**Combination:** Stopping bleeding and curing infection touch different fields and have different update rules. A cure operation that clears a flag cannot substitute for this counter reduction merely because both are “healing.” The native tissue-healing method can also zero the bleeding counter, but only after its more restrictive repair-state conditions below.

**Limits:** This method does not refill a global blood reserve, remove a wound, treat all anatomy with primary `-1`, or show prevention of future bleeding. Native admission may expand a whole-actor effect into repeated concrete-selector calls; that higher-level expansion remains unread. The wildcard difference must not be mistaken for a played bug.

## DF-NC4: Tissue healing repairs state, then recomputes aggregates

Source: `native-0x140d7c330.c:72–203`; assembly `0x140d7c36f–0x140d7c614`. Helper: `native-0x140d87830.c:100–180` and its complete retained assembly.

The tissue method computes the same scale formula and enters the same nested record vectors. Unlike the two previous methods, either primary or secondary selector may be `-1`. It skips an outer record when its byte `+0x2c` has bit1 set. This bit's original name is unknown; it is a real exclusion, not a general promise to heal all injuries.

For selected inner records it clears positive dwords at `+0x10` and `+0xa0`. It walks three parallel short-element arrays backward. An element is eligible when its corresponding short in the array rooted at `+0x18` is at most the computed threshold. Eligible entries are erased at the same index from arrays rooted at `+0x48`, `+0x18` and `+0x30`, and each end pointer decreases by2. Reverse iteration preserves remaining indices while the arrays shrink. It does not merely subtract the threshold from every array element.

Under an outer-record bit2 exclusion, a short at `+0x98` in range1..99 and at most the threshold is reset together with adjacent state at `+0x9c`. Other branches clear field `+0x64` masks `0x70`, `0x380`, and, when `+0x10` is zero, `0x9243000`. If the outer bit2 is absent, `+0x98` is zero and the short-array at `+0x18/+0x20` is empty, further cleanup zeros a positive `+0x6c` counter and clears additional masks/bits in `+0x64` and bit1 at `+0x68`. The full masks are retained in pseudocode and assembly; their clinical names have not all been established.

**Combination that is now concrete:** Mask `0x70` includes `0x20`, the exact infection-associated bit cleared by DF-NC2. Tissue healing can therefore overlap cure infection for matching, eligible records. It can also clear the bleeding counter in its fully repaired-state branch. That overlap is conditional; neither “all healing effects are independent” nor “heal tissues replaces every cure” follows.

After any change, a direct call at `0x140d7c614` invokes `0x140d87830` with the original actor argument. This helper zeroes four aggregate arrays, walks surviving nested injury records with concrete selectors, joins each to body/tissue metadata via actor `+0x5f8`, accumulates qualified weighted values, caps observed aggregate sums at1,000,000,000, updates another maximum-like value and refreshes actor flags. It is an explicit derived-state rebuild, so clearing a leaf record alone is not the whole cleanup path.

**Decompiler correction boundary:** A reused temporary in the pseudocode appears to carry an outer-record pointer into later reporting code. The assembly reloads the original saved actor into `r15` before the aggregate call and reporting path. The retained instruction addresses settle that alias ambiguity; pseudocode variable names do not establish actor identity by themselves.

**Limits:** No containing-wound deletion, full anatomy regrowth, scars, exact meanings of the masks, all damage categories, all excluded outer records, syndrome cure or lifecycle dispatcher are established by this method. The helper's derived arrays are structurally traced; their original field names and player-visible values remain unresolved.

## DF-NC5: Job cancellation cleans both sides of item references

Source anchor: native string ` cancels ` at VA `0x141781860`, file offset24644192. The exact LEA at `0x141325395` is decoded and targets that string. Its `.pdata` region is `0x141325080–0x141328443`, file offset20071552,13251bytes. Pseudocode `native-0x141325080.c` has2068lines; this pass reviews selected entry/formatting/cleanup windows, not every reason-switch branch.

The routine reads a current-work pointer at actor `+0x4d8`, formats actor/job cancellation text, has multiple early/branch-specific exits and eventually takes a common detach path. Its selected cleanup tail:

| Actual call site | Target | Connected operation |
| --- | --- | --- |
| `0x1413251ee` | `0x140d026a0` | Early special branch removes a selected item entry |
| `0x141327e2a` | `0x140d02ea0` | Detach job items and selected references, with branch-dependent all-items flag |
| `0x141327e42` | `0x140d09950` | Remove reference type `0xe` for one job-type branch |
| `0x141327e5e` | `0x140d09950` | Remove reference type `0x1b` for another branch |
| `0x141327e6f` | `0x140d09950` | Remove reference type `0x13` |
| `0x141327ea7` | `0x140a67820` | Conditional job destruction/unlink |

These call edges are decoded E8 instructions in `notes/instruction-refs.json`, not empty Ghidra callee lists.

### Detach helper, `0x140d02ea0`

It traverses the job's item-entry vector `+0x80/+0x88` backward and calls `0x140d026a0` either for all entries or for entries outside the observed role-value interval2..4. It then clears job flags with mask `0xffffffd3` and clears bit1 on surviving item-entry flags at `+0xc`.

It separately visits a typed reference vector `+0xb0/+0xb8`, removes selected reference types (`0x26/0x27`, plus type `0x25` for selected job types), invokes a type-specific virtual destructor at vtable offset `+0x78` and erases the pointer. A selected reference path calls `0x1405be610` with actor ID before deletion; that downstream helper was not inspected. Original enum names remain unresolved.

### Item removal, `0x140d026a0`

Given a job and item-entry index, it finds the referenced object and scans that object's reverse-reference vector `+0x20/+0x28` backward. A reverse record must have kind2 and a stored pointer equal to the current job. The helper frees that reverse record (observed size0x18), erases its pointer and shrinks the object's vector by8.

For item-entry role other than6, it scans another reference list for virtual kind `0xc`; if none is found it clears bit2 in the object's flags at `+0x10`. It finally frees the job's item-entry wrapper (0x18), erases its pointer from the job item vector and shrinks that vector by8. The native instructions establish the bilateral unlink and wrapper cleanup. Calling the unnamed bit “reserved/in-job” is an interpretation supported by context, not a recovered enum declaration. The extra kind-`0xc` test is a concrete condition on whether that bit clears.

### Typed reference removal and job destruction

`0x140d09950` removes every matching type in the job reference vector through virtual destruction plus vector erase. `0x140a67820` calls an unread unlink helper `0x140d022c0`, invokes the all-items detach helper, rewires predecessor/successor pointers around a linked node, frees that node, releases several owned containers/strings and frees job storage with observed size0x148. The last argument to an allocation helper is evidence of storage cleanup, not a promise about transactional refunds.

The cancellation routine can instead retain/reset a job in a related owner's vector: it removes an existing occurrence, appends the job, resets dword `+0x24` to-1 and clears a flag. Finally its common tail clears actor `+0x4d8`, resets actor coordinates/work fields to sentinel values and empties three actor vectors by resetting end pointers to starts. Thus cancellation is branch-dependent and can requeue/retain rather than always destroy the job.

**NPC use:** The actor argument and current-work object connect the cancellation routine to the same world objects used by autonomous work. The actual AI policy that chooses jobs or decides cancellation remains unread. This pass establishes what selected cleanup paths do once invoked, not which NPC invokes them or when.

**Limits:** The full reason switch, all job types, reservation acquisition, partial stack accounting, materials already consumed, reagent refunds, produced outputs, concurrency, world unload and save transactions remain unreviewed. A bilateral reference cleanup does not prove an atomic craft rollback.

## DF-NC6: Effect-object deletion is separate from timed reversal

The cure class slot1 method `0x140d556c0` allocates0xe8bytes, constructs an object at `0x140d55760`, copies common fields through `0x140d54940`, copies the `+0x98` field and owned containers. Slot2 method `0x140d558c0` invokes destructor-like `0x140d55830` and conditionally frees storage if a flag is set. The destructor resets the vtable and releases owned vector-like fields; it does not receive the actor injury vectors changed by slot3.

This closes a memory-ownership boundary for an effect-definition object. It does not identify the scheduler that expires an active syndrome, remove actor-added tags or reverse a transformation. “The definition object is freed” and “all actor effects roll back” remain different claims.

## Remaining work, bounded by what changed

The selected native consumer methods and helper chain are now captured and interpreted. Highest-value next evidence is the caller that supplies concrete part/tissue selectors and the scale argument to slot3, followed by the syndrome expiry/removal dispatcher. That would resolve whether a whole-actor raw effect expands through repeated calls and how overlap behaves. Native-job follow-up should name one role/type value before inferring reservation semantics. There is no need to start another broad dump merely to repeat these selected bodies.
