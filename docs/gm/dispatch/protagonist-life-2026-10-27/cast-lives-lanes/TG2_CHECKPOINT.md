GPT-6

# TG2 checkpoint

The session reports GPT-6; the brief requested gpt-6-luna. Results are therefore attributable to the reported GPT-6 session, not Luna.

## Counts

- Input rows: 140; rows with paragraph text: 140.
- Output rows: 140.
- Kind: act 50, perceive 18, think 10, speak 52, report 2, narration 8.
- Shown: yes 23, partly 34, no 83.
- Actor class: lead 71, other 47, unknown 22.

## Commands and checks

- `python3` input probe: 140 rows and 140 rows with paragraph text.
- `node` schema and locator validation: passed, 140 rows in input order; both bases resolve to cited paragraphs.
- `node` actor registry validation: passed; all actors are `lead`, `unknown`, or registered person IDs.
- `node` enum validation: passed for kind and shown values.

Scoring against reviewed verdicts remains with the coordinator.
