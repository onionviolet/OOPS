# G1 brief: wait until a time, and beats that teach the people who saw them (CL210, CL222)

Model: `gpt-6.1-sol`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, beside W1
(no shared files). Do not commit; the coordinator commits. Never stash, reset, force or push.
Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md) (CLR codes); plan section 22 (CL214-CL220) governs.
Rules: `.claude/rules/runtime-code.md`, AR1-AR16, `.claude/rules/player-ui.md`, AD43. Target 1920×1080.

## Publication class (CLR3)

Engine and UI code name-free; any cast-specific knowledge text lives in the private pack; tests synthetic;
screenshots private.

## Data probe (CLR2; gate counts)

Gate: the combined gap ledger (`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l5r-ui-replay-2026-10-28/combined_gaps.jsonl`)
has 32 rows, with one `missing UI path` (waiting) and five `aftermath` rows. Stop if the file is missing.

## Two capabilities, both world-general

**A. Wait until.** A player can choose "Wait until [next band or a known appointment time]" where they
are, quoting the minutes (SUI6), using the existing game clock and the same time advance the game already
uses for sleeping or idling (find it; no second clock, AR3). Interrupted by the existing interruption
rules if any. Second case (CL214): any world with timed services or appointments (opening hours, a
teacher's window, GM1). Offer it in the beside life first; make it available to other worlds through the
same seam only where their panel already lists actions.

**B. Aftermath writes knowledge.** When a beat settles, its `knows` effects (pack data) are written to
the knowledge owner for each actor who learned something (the beat's actor and present people), dated,
with the beat as the basis (WA12, AD6-AD8). The player's knowledge changes only through their own
witness level (RPT2). Second case: every cast beat in every world, and the MoL pack. Off-screen people
outside the player's footprint settle by outcome (CL216) with the same knowledge writes.

## Ramifications to state (CL220)

New save fields (expected: none for A; knowledge entries for B through the existing owner), the
compatibility decision, and what changes for the four original LOTM starts (expected: nothing).

## Owned files

New `src/` module(s) for A if the seam needs one; hunks in `src/book_world_lotm_cast_host.js` and
`src/book_world_lotm_ui.js` for the beside life; the private pack's beat `knows` fields; focused tests.
For any needed hunk outside these, write a prepared patch and continue with the rest.

## Done check

- Focused tests; the L5r replay's waiting step and the five aftermath rows rescored (expected: the
  waiting step reproducible; aftermath rows closed or narrowed).
- Browser at 1920×1080 from a fresh origin: wait-until quote and result; a person's knowledge after a
  witnessed beat in the person view. Zero page errors; bundle hash. If the sandbox blocks the browser,
  say so (the coordinator runs it).
- `npm run check:arch` no growth; checkpoint `cast-lives-lanes/G1_CHECKPOINT.md` with FLR1-FLR6.
