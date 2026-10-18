# Output factory, count setter and holder placement

Source representations: `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-4/extraction/extract/`. The pinned executable hash is in [REPORT.md](REPORT.md). Native addresses are stable only for those exact bytes.

## DF-OC1: Source accounting precedes optional output emission

Prior selected method `0x140cc9230`, retained in round3 audit, traces a corpse/corpse-piece material-harvest path. It marks an eligible component consumed or appends an explicit partial extraction record before the output branch. Its extracted count and remaining budget are separate fields. Output emission requires the method's output flag and two nonnull job/holder arguments. A route that intentionally suppresses output is not automatically a placement failure.

The new retained caller instruction window starts at `0x140cc9863` and ends at `0x140cc9930`. It includes source-record field writes/vector append, the three output gates and the following sequence:

| Call site | Target | Actual stage |
| --- | --- | --- |
| `0x140cc98b1` | `0x1407df320` | Construct output object |
| `0x140cc98c1` | Virtual `+0x488`, glob slot145 | Assign extracted count to returned output |
| `0x140cc98d5/0x140cc98e0` | Direct field writes | Assign output material selector at `+0xb8` and companion material field at `+0xbc` |
| `0x140cc98e6` | Virtual `+0x328` | Additional item lifecycle/registration-like operation, exact semantics unread |
| `0x140cc98f8` | `0x14054bdc0` | Attach output to holder |
| `0x140cc991a` | `0x140d028e0` | Add bilateral job/item association, role1 |

The caller saves the newly returned object pointer and uses it throughout. It does not check for a null factory return, test a success boolean from the quantity method, or inspect the holder wrapper returned by placement before the reservation call. This states the selected normal control flow; it does not establish allocator failure behavior, exception unwinding or absence of all hidden global effects.

## DF-OC2: The factory initializes a new glob

`native-0x1407df320.c`, full selected87byte native unwind region `0x1407df320–0x1407df377`:

The factory allocates0xd0bytes, calls base constructor `0x1400fc720`, writes vtable `0x1416bdbc0`, initializes a16bit material-related field `+0xb8` to0x1a3, zeros the eight bytes starting at `+0xbc`, zeros `+0xc4`, and writes dword `+0xc8=0x96` (150). It returns the allocated object.

The vtable is joined independently to MSVC RTTI `item_globst` and its slot145 points to the count setter below. The field `+0xc8` is structurally distinct from inherited item stack count `+0x80`. The caller overwrites selected material fields after construction, so factory defaults are not the final species/material assignment.

The factory accepts no source-item pointer or consumed-count ledger. Its inspected body does not restore a prior item count or extraction mark. The allocator/base constructor and exception policy remain unread. No normal null/error branch in the factory is equivalent to a guarantee allocation cannot fail.

## DF-OC3: Output count is an assignment, not a positive stock delta

`native-0x1400fc5b0.c`; exact leaf bytes `0x1400fc5b0–0x1400fc5cc`:

1. Clear bit `0x20000000` in item dword `+0x10`.
2. Store EDX as signed32bit count at item `+0x80`.
3. If negative, replace the count with0; return.

The method does not add to the old count. It therefore differs from slot144/delta method `0x1400fc590`, recovered earlier. In this caller it receives the new output pointer, not the consumed input. A positive quantity here is not evidence of compensation or refund.

No upper cap is present in this selected setter. The caller's valid extracted-count range is a separate question. The method is a leaf absent from the selected `.pdata` entries, so its return instruction and exact bounded bytes provide the boundary rather than assuming a nearby unwind region belongs to it.

## DF-OC4: Placement stores ownership and location

`native-0x14054bdc0.c`, fully read pseudocode. The first `.pdata` region is `0x14054bdc0–0x14054be6a`; native control flow continues into additional chunks. A separate308byte reached-code envelope `0x14054bdc0–0x14054bef4` includes the final return at `0x14054bef3`. The envelope is explicitly distinguished from a single unwind region.

The routine receives a holder-like object and output item. It calls `0x140072660(item,0x24,holder[+0x50])`, then allocates a0x10byte wrapper containing the item pointer and a zero16bit field. It appends that wrapper to the holder's vector at `+0x128/+0x130/+0x138`.

If the item has flag1 in `+0x10`, it calls helper `0x140c911d0(item,1)`. It copies holder16bit coordinates at `+0x10/+0x1c/+0x20` into item `+8/+0xa/+0xc`. Additional conditional paths inspect an item reference of virtual type1 and call `0x141524200`; a byte flag at item `+0x14` can call `0x140cc9aa0`. Original enum names and those downstream helpers are not all recovered.

Its return is the wrapper pointer. There is no explicit capacity check, success/failure boolean or branch restoring source material in the selected body. The caller ignores the pointer return and proceeds to reserve the output for the job. The routine's item/reference synchronization is not proof that output reaches a visible floor tile or is usable by a player.

The holder type is deliberately qualified. Its ID, owned-wrapper vector and coordinate fields are shown, but naming it a specific building type would require another structural/type consumer. The reference helper is also still a dependency; the chosen type0x24 is observed, not expanded into an unverified original enum name.

## DF-OC5: Failure and rollback limits

The selected path has source accounting before output creation and no local compensating source write in factory, setter or placement. That establishes ordering. It does not establish one complete failure transaction.

The paired auditor found a dispatch caller that tests the dispatch result and a separate out-byte before invoking cancellation. This extraction independently verifies that policy, but has not traced this exact harvesting case through every dispatcher return into that failure branch. It therefore does not claim that a particular observed execution consumes material and then fails placement, that cancellation always refunds, or that cancellation never refunds.

The next authoritative static gate is precise: identify a post-consumption failure edge for this case, then follow it to either a source quantity/extraction-record restoration write, a retained partial-progress state, or definitive disposal. Exception cleanup, output registration helper `+0x328`, lower-level reference insertion and persistence must stay distinct. No native failure injection or save manipulation was authorized or performed.
