# Independent review of cancellation/refund findings

The paired auditor owns round4/audit. This extraction read its stable `native-0x14136bae0.c` and `dispatch-caller-policy.txt` under private `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-4/audit/extract/`.

**DF-OX1:** `0x14150614a` calls the selected dispatch routine. It tests AL, then, only on false, tests a separate stack out-byte. The false-result plus nonzero out-byte path reaches cancellation `0x141325080` at `0x1415061ba`. The later region has additional type/owner policy and can create another job-like object. This confirms one failure-policy branch; it does not join every consumed-material case to it.

**DF-OX2:** The separately decompiled postwork helper `0x14136bae0` checks a current job, derives a table-weighted amount from job flags/type, adds it to actor `+0x484` and calls a further helper. It does not write item quantity `+0x80` in the read body. Treating that positive scalar adjustment as material refund would be unsupported. Downstream helper semantics remain open.

**DF-OX3:** The auditor independently checked the glob factory identity, output setter, holder wrapper/coordinates and ignored return. The factory's `+0xc8=150` is explicitly kept separate from stack count `+0x80`. Neither lane claims a general refund policy or immediate deletion from a queued removal request.

This is a scoped cross-review of the named edges and representations, not blanket certification of the large native dispatcher or complete transaction system.
