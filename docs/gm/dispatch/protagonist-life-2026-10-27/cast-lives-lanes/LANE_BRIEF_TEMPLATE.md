# Lane brief: <ID and outcome>

## Data probe (CLR2)

Before editing, count the fields this lane depends on. Record observed and expected counts. Stop only if a named gate count is under half its stated expectation; otherwise adapt to the data and record the result.

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| <field> | <count> | <count> | yes/no |

Model: `<model>`, `<effort>`. Publication class: public code (name-free) / private pack (canon data or book text) / private research. Cite applicable CLR rules from [CAST_LIVES_CARD](../CAST_LIVES_CARD.md).

## Scope and seam

- Outcome and player sentence: <what the player sees and when it cannot run>
- Files owned: <exact paths>
- Publication class per output: <class and path>
- Seam and location authority (CLR10): <owner, call site, clock/record authority>
- Save fields, compatibility or migration, economy source and sink: <none or details>
- Actor parametrization (CL225): parametrize by actor; lead-specific parts are book-pack data (local book pack, not published). Review greps the diff for lead-only branching.
- Disclosure (CL228): each new panel or block names its disclosure group and its perspective tag (CL243), and gets a 1920×1080 screenshot.
- Out-of-grant rule (CLR9): do every fix possible inside the grant; for a needed hunk outside it, write a prepared patch and continue.

## Work and done check

- Mechanism and ordinary route: <how it works; default, dial, reason and one fitting exception>
- Failure case: <what must remain true when it cannot run>
- Verification: <focused test and required route/persistence evidence; cite FLR lines>
- Done when: <observable result, exact checks, and remaining gaps>
- Stop conditions: <specific correctness or named data-probe gate>
- Known ambiguities default (CLR12): <chosen reversible default and why>

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
