# P15 native save authority decision, 2026-10-14

Status: proposed boot/save-format decision; no runtime implementation.

The feature contract `src/absorb_p23/save_time_options/CONTRACT.md` requires:

> P00 must first resolve which envelope becomes authoritative at boot and how legacy saves are adopted without altering their bytes.

> Do not sequence undo(), a legacy-key write, and reload and call it atomic: quota/error after the first write splits journal from live state.

The current native authority is the ordinary release save key, selected by main and protected by its existing lifetime navigator writer lock. P15's separate journal is deliberately not that authority. The module can safely capture/download, but its undo swaps journal snapshots only. That does not restore native gameplay.

Proposed integration:

1. First explicit backup enrollment publishes one validated native envelope to a new release-scoped authoritative key. It contains the complete live native envelope and an optional bounded backup journal with current/previous native snapshots. Strip journal metadata from captured snapshots to avoid recursive growth. Preserve every existing legacy key byte-for-byte.
2. Boot chooses the new authority only when present and fully valid. Otherwise existing saves continue through the current legacy path without implicit migration. Do not silently fall back after rejecting a corrupt new authority. Keep the existing original release writer-lock namespace so an old and new writer cannot run concurrently.
3. Native saves, imports and backup capture/undo then publish through that one key. Native undo validates/preflights its candidate and retained snapshot, checks ownership/revision/quota, performs exactly one durable write, and holds the busy guard until reload reconstructs all native owners. Any failed write leaves the previous authority unchanged. No two-write journal/live handshake.
4. Existing legacy saves remain preserved archives after enrollment; they are not synchronized with the new active authority. Older binaries do not understand the enrolled authority. This compatibility difference must be explicit before implementation, tested against old-save defaults and unsupported schemas, and recorded in P00's report.
5. Multi-character slot switching and N29 offline accounting remain outside this decision. N29's eligibility/death/sleep/exposure/cap/remainder/anti-double-credit policy is still unselected; no catch-up is proposed.

Alternative: retain current authority and expose capture/download only. Native Undo/slots and P15's complete gameplay gate remain OPEN. Neither option is claimed implemented or accepted.

Q2 was raised to the coordinator because it changes boot authority and compatibility, not because another finished lane owns a file. All finished-lane integration file authority remains transferred to P00. The proposal preserves the current reader/publisher and does not invent a second gameplay engine.
