# NetHack: small touches, 2026-10-14

Each entry is an original PROPOSAL derived from the linked source aspect. Source facts are in ASPECTS, not asserted as absent from YAIRPG. Use the current owner before adding anything. None is runtime-verified here.

## NetHack

| ID | Small touch / caution | Source evidence | Likely YAIR owner |
|---|---|---|---|
| nethack-T01 | Show a reason-specific refusal before committing a chat. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T02 | Let a returned quest actor recognize completed work. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T03 | Treat language/body/perception as actual speaking eligibility. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T04 | Use explicit friendly/hostile state for lines, not a global mood guess. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T05 | Keep a short recap when a long passage closes. | [A02](ASPECTS.md#A02) | `src/display.js / existing content owner` |
| nethack-T06 | Let history recall the fact without replaying the reward. | [A02](ASPECTS.md#A02) | `src/display.js / existing content owner` |
| nethack-T07 | Provide a safe common fallback for a missing role-specific line. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T08 | Keep a stable message ID separate from final wording. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T09 | Resolve names and pronouns from the active actor at delivery. | [A01](ASPECTS.md#A01) | `src/display.js / existing content owner` |
| nethack-T10 | Offer price information through an existing actor interaction. | [A06](ASPECTS.md#A06) | `src/display.js / existing content owner` |
| nethack-T11 | Separate seen appearance from known identity. | [A10](ASPECTS.md#A10) | `src/display.js / existing content owner` |
| nethack-T12 | Update carried-item information after a real learning result. | [A10](ASPECTS.md#A10) | `src/display.js / existing content owner` |
| nethack-T13 | Put long text in its own reading surface. | [A11](ASPECTS.md#A11) | `src/display.js / existing content owner` |
| nethack-T14 | Keep cosmetic random choices off the gameplay sequence. | [A08](ASPECTS.md#A08) | `src/simulation.js` |
| nethack-T15 | Give a delayed effect a named subject. | [A09](ASPECTS.md#A09) | `src/simulation.js` |
| nethack-T16 | Separate area-local timers from actor-following timers. | [A09](ASPECTS.md#A09) | `src/simulation.js` |
| nethack-T17 | Rebuild derived pointers instead of serializing stale addresses. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| nethack-T18 | Explain version mismatch precisely while preserving old artifacts in YAIR. | [A04](ASPECTS.md#A04) | `src/native_storage_transaction.js` |
| nethack-T19 | Record whether a challenge was actually entered. | [A12](ASPECTS.md#A12) | `src/display.js / existing content owner` |
| nethack-T20 | Allow a later attempt after a voluntary conduct failure. | [A12](ASPECTS.md#A12) | `src/display.js / existing content owner` |
