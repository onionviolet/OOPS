# Native effect lifecycle and cleanup

All addresses apply to executable SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`. Full source representations are in `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-3/extract/`; filename `native-0xADDRESS.c` names the native entry whose pseudocode was retained. These are inferred decompiler representations, not recovered original C++.

## DF-LC1: Three different object lifetimes

The trace distinguishes three layers:

| Layer | Observed location | Lifecycle evidence |
| --- | --- | --- |
| Definition | RTTI-bound creature interaction effect and syndrome definition tables | Reusable timing/flag/attribute declarations and virtual methods |
| Active syndrome instance | Actor vector at `+0xca0/+0xca8`; instance starts with definition index and has per-effect state vector at `+0x30/+0x38` | Admission, exposure/refresh, age, per-effect counters and actual removal |
| Source contribution / injury-like record | Actor vector `+0x5b0/+0x5b8`; record ID, source field `+0x30`, optional payload `+0x50` | Effects write source-associated aggregate contributions; later reset/rebuild and source removal |

The last vector is also used by the injury/healing methods from round2. A record can hold effect contribution payloads without being an ordinary physical wound. This distinction prevents treating all record removal as anatomy repair.

`0x1413c1ef0` allocates0x60bytes, initializes a record, assigns the actor's increasing ID from `+0x5c8`, appends it to `+0x5b0` and updates actor flags. Add/remove-flag and attribute-effect methods lazily create this record, copy the active instance's source identity into record `+0x30`, and save the created record ID in the active instance at `+0x28`. The optional payload is allocated separately at0x118bytes.

`0x140d80270` ORs add-flag masks into payload `+4/+0xc`; `0x140d80320` ORs remove-flag masks into separate `+8/+0x10`. `0x140d814b0` initializes an attribute subblock at payload `+0x90` if needed, multiplies six existing percentage fields by the effect's percentages with signed integer division100, and adds six absolute fields. Order can therefore matter for composed multipliers and rounding; universal commutativity is not established.

The creature-effect hierarchy uses slot3 for these contributions. The separate `interaction_effect_add_syndromest` hierarchy uses a different virtual layout: its slot3 at `0x140c3fc50` is destructor-like, not the actor apply method. The actual application method traced here is `0x140c52cf0`. A slot number cannot be copied across unrelated hierarchies.

## DF-LC2: Admission reaches an actual active instance

`0x140c52cf0` iterates the interaction's syndrome definitions, applies a creature/caste eligibility helper, and calls `0x1413c5ef0` for eligible targets. It also contains historical/source-record attachment paths, so not every branch means immediate live actor application.

`0x1413c5ef0` searches the actor's `+0xca0` active-instance vector by definition index, with a further identifier-string matching route. It records exposure/history counters separately from the active instance, allocates the active instance and its0x98byte per-effect states, rolls initial effect admission against the definition's probability, and initializes either whole-actor or per-target counters. Source arrays, concentration-capped and non-concentration paths are distinct. Re-exposure can raise or add amounts depending on concentration settings and can adjust per-effect elapsed counters toward a peak boundary. The full628line method is retained; the report interprets selected windows rather than claiming every exposure branch complete.

When immediate evaluation is requested, admission calls `0x1413dcd00`. A terminal result leads to source cleanup and destruction instead of retaining an inert active instance. Successful admission therefore does not prove long-term persistence, and a raw declaration alone does not prove admission.

## DF-LC3: Timing fields, limits and abrupt flags

The common native parser `0x140d78c30` compares exact raw tokens and writes:

| Token | Definition offset | Observed bounds and coupling |
| --- | --- | --- |
| PROB | `+0xc` | Integer parse; no clamp established in this selected branch |
| START | `+0x10` | Clamp0..1,000,000 |
| PEAK | `+0x14` | Clamp0..1,000,000; raises an already finite END below it |
| END | `+0x18` | Explicit value clamps0..1,000,000; lowers PEAK if PEAK exceeds it |
| DWF_STRETCH | `+0x1c` | Clamp1..1000 |

A definition constructor can supply END sentinel−1 when the token is absent. Explicit negative END parsed by this common branch clamps to0; absence and an explicit negative value are different inputs. Actual subtype/default constructors still need their own checks before applying that general distinction to every effect family.

Other parsed flags include SIZE_DELAYS bit1, SIZE_DILUTES bit2, VASCULAR_ONLY bit4, MUSCULAR_ONLY bit8, RESISTABLE bit0x10, LOCALIZED bit0x20, ABRUPT_START bit0x100 and ABRUPT_END bit0x200 in definition `+8`. ABRUPT sets both0x100/0x200. DAY_RANGE handling at `0x140d54a30` clamps two day bounds0..27 and uses bit0x40; the independent runtime day gate is preserved, without claiming a real-world calendar conversion.

The parser fields are confirmed through matching literals and writes; this round does not recover every subtype's severity field or raw grammar. START/PEAK/END values are not labeled as seconds or globally interchangeable with actor turns.

## DF-LC4: Native update resets a source, then reapplies eligible effects

`0x1413dcd00` is the actual active-instance updater. It increments instance dword `+0xc` once per invocation. The selected caller's scheduling frequency is still unknown.

It finds the source contribution record using the active instance's saved record ID and actor `+0x5b0`. Before evaluating effects, it moves selected prior values aside, zeros current contribution counters and add/remove flag words, resets percentage defaults, resets attribute modifiers through `0x140c62120`, and puts body-transformation target fields back at−1. The reset helper initializes percentage groups to100 and additive groups to0. It also resets current contribution fields on nested injury entries.

It then visits each per-effect state associated with the definition's effect array. State flag bit1 at `+0x88` skips a state already marked inactive. An effect's time multiplier is1 except for an explicit mode-global branch that uses definition DWF_STRETCH. The signed start test compares active-instance age with START×multiplier.

Whole-actor and localized effects have separate elapsed/accumulator storage. Finite eligibility compares elapsed with `(END−START)×multiplier`; END−1 admits the indefinite route. A pre-peak and post-peak ramp modifies the scale passed to the native effect method unless the corresponding abrupt flag disables that ramp. Integer division truncates; nonzero amounts that would truncate to0 can be raised to1. Size-delay, resistance, dilution and optional counter/day gates are separate branches, not one tag check.

Two exact virtual callback instructions connect this updater to the round2 consumers:

| Instruction | Route | Arguments visible in assembly |
| --- | --- | --- |
| `0x1413dd5e1: call *0x18` | Whole-actor | Computed32bit scale at stack+0x20; primary/secondary16bit selectors both−1; pointer to source-record slot |
| `0x1413ddacf: call *0x18` | Localized | Same scale slot; two16bit selectors loaded from stored target arrays; pointer to source-record slot |

This resolves the prior gap between callback body and actual dispatcher. It also explains why a caller's selector route matters: the cure/bleeding methods from round2 skip primary−1 while tissue healing accepts it. The trace establishes that the dispatcher has both routes, but does not prove every authored healing definition chooses the expected one or that every target is eligible.

Eligible states maintain accumulator and elapsed counters. If no supported active route remains for a state, it marks bit1 at per-effect `+0x88`. The routine tracks whether any effect remains active. The native epilogue at `0x1413ddcf3` tests the tracked byte and `0x1413ddcf6` executes `sete %al`, then returns at `0x1413ddd1f`. Thus the caller receives true when the tracked active byte is zero. Ghidra's inferred void signature is wrong here; the instruction and caller test establish the boolean boundary.

**Limits:** This is progress per call, not a proven one-tick-per-render-frame policy. Active-before-start handling, every resistance/day/counter branch, integer-overflow admissibility and all localized target cleanup are not exhaustively reviewed. A diagnostic count mismatch branch exists and can break effect traversal; it is not treated as a normal expiry proof.

## DF-LC5: A real owner removes the inactive instance and its source

A bounded768byte instruction window in native region `0x1413547e0–0x14135e678` supplies the decisive owner path. This pass does not decompile or semantically read that entire40,600byte region.

At `0x141355916`, it calls the updater. At `0x14135591b`, it tests AL; false branches to the next active-instance iteration. On true:

1. It scans actor contribution records at `+0x5b0` backward and compares record source `+0x30` with the active instance's definition/source identity.
2. Matching records free optional payload blocks at `+0x90` and `+0x98` with observed sizes0x98 and100, null those pointers and set source `+0x30` to−1.
3. At `0x141355a77`, it calls active-instance destructor `0x141345b70`; at `0x141355a82`, it erases the corresponding actor `+0xca0` vector element.
4. After the loop it calls two further actor-state helpers at `0x1413857d0` and `0x141384de0`. Their full downstream semantics remain unread.

The active-instance destructor releases its per-effect states and their owned vectors, then instance vectors and0x68byte storage. This is a different class/storage size from the earlier effect-definition destructor. The direct source-matching cleanup is native, not inferred from object names.

Source association is by the observed integer identity. This pass does not establish uniqueness across every identifier alias/re-exposure arrangement or whether a physical contribution record is later deleted by another sweep. It also does not prove general undo of damage already dealt, restored blood, scars, social changes, equipment placement or every permanent effect.

## DF-LC6: What this says about combinations and NPC use

The selected combination mechanism is source reset plus recomputation, not a blind subtraction of every old bonus. Add and remove masks occupy separate words; attributes compose percentages/additions into a source payload; body-transformation candidates can be selected and cached per effect state. Expiry stops reapplying the ended state and the owner removes an inactive instance and selected source subblocks. That provides a concrete lifecycle design reference, while all overlap precedence and transformations still need downstream aggregate/body consumers.

The updater takes a generic actor argument. It has no selected player-only admission check around its core contribution update. A separately captured caller `0x140a31ff0` invokes it over an actor's active-instance vector in a job/action-related path; the exact action meaning remains unresolved. Two other tiny call-context windows show calls from a much larger native region; their surrounding scheduling policy remains unread. This is stronger than a generic capability marker, but is not proof of a complete NPC planner, offscreen policy or native game result.

The attempted adjacent20,280byte and13,264byte candidates `0x1413bcfb0`/`0x1413c2560` use injury-like structures and were not the expiry scheduler. They are retained with mostly unread complements. Adjacency did not supply semantic identity; the successful route came from the actual admission call and its boolean result owner.
