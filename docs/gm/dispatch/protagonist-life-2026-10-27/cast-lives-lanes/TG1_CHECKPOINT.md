# TG1 checkpoint: blind paragraph tag pilot

## Resume 1

The replacement input passed the probe: 140 unique steps, all 140 with text.
The private output contains 140 tags in input order. This pass used
`gpt-6.1-terra`; the brief specified `gpt-6-luna`, so model identity is a
material limitation when interpreting the pilot. The output filename retains
the brief's requested name.

| Field | Counts |
| --- | --- |
| Kind | act 49; perceive 7; think 6; speak 58; report 4; narration 16 |
| Shown | yes 10; partly 54; no 76 |
| Actor class | lead 44; other 32; unknown 64 |

Checks: a Node input probe counted 140 lines, 140 with text and zero duplicate
IDs. A Node validation of the output against the input and merged registry
found 140 rows in order, zero invalid actor IDs, zero bases outside their
input paragraphs and zero invalid kind, shown or empty note fields. An initial
validation found three invalid actor IDs; registry lookup and correction preceded
the passing check. No scoring against reviewed verdicts was performed. The
citation command was not called during this resume. CLR1–CLR4, CLR12 and AD36.

## Original stop

Status: stopped at the CLR2 data gate. The permitted pilot input has 140 lines,
but the required citation command resolves 0 of 140 step IDs (0%, below the
50% minimum). No paragraph tags were produced; `pilot/luna_tags.jsonl` was not
created. The citation route must be repaired or the brief revised before a
blind tagging pass can continue.

Counts by tag field: no tags emitted; kind, shown and actor-class counts are
all zero. Input lines: 140. Cited steps: 0. Actor IDs were therefore not
checked against the registry.

Checks run:

- `wc -l .../step-tags-2026-10-29/pilot/pilot_input.jsonl` — 140 lines; gate
  passed.
- `node scripts/lead_run/cite_paragraphs.mjs ... --id 'lr.lotm.main.106#5' --merged .../merged` — 0 paragraphs for the first input ID.
- One-line Node probe over all 140 input step IDs using the citation module —
  0/140 IDs produced paragraphs (0%); stopped under CLR2.

No reviewed rows, review checkpoints, or other files in the step-tags folder
were opened. No tag output or scoring was performed.
