# L7 reaction classification checkpoint, 2026-10-28

Status: slice rows exported and classifier expanded; agent-verified, not human-reviewed.
The label file is private and includes source `to`/`response` text. Public code and this
checkpoint contain no quoted book text. Codes: CLR1-CLR3, CLR9, CL56, CL60, CL77, CL112.

## Counts

| Book | Rows | Trigger classes (study, practice, research, craft, trade, work, travel, fight, socialize, rest, care, appraise, ritual, other) | Response classes (same order) | `by` ID |
| --- | ---: | --- | --- | ---: |
| LOTM ch. 1–24 | 196 | 11, 0, 7, 7, 8, 7, 13, 3, 54, 3, 2, 0, 1, 80 | 9, 0, 6, 3, 7, 4, 5, 3, 46, 4, 6, 0, 0, 103 | 107 (54.6%) |
| MoL first loop | 100 | 13, 1, 0, 3, 0, 3, 5, 8, 22, 1, 7, 0, 0, 37 | 3, 1, 1, 2, 0, 3, 4, 3, 23, 1, 3, 0, 0, 56 | 35 (35.0%) |

`by` is set only when a person name in the trigger text matches a registry person label, alias or id;
otherwise it is null. The inputs themselves contain no `by` values. `other` retains rows whose
text does not identify a WA25 action class without adding context from outside the row.

## Classifier comparison

| Book | Prior classifier placed | Expanded classifier placed | Change |
| --- | ---: | ---: | ---: |
| LOTM | 79/196 (40.3%) | 116/196 (59.2%) | +18.9 points |
| MoL | 37/100 (37.0%) | 63/100 (63.0%) | +26.0 points |

These are placement rates, not independent semantic accuracy: trigger classes in the private
file were assigned with the expanded deterministic rule set, so agreement with those labels is
not a held-out validation. The increased coverage is a useful CL60 input, but the remaining
`other`/unplaced share means the local derived field remains valuable; recommendation: retain
`reacts.class` as an optional schema 1.5 field for cases where the row carries an action the
local text classifier cannot recover. `reacts.by` likewise remains useful where the actor is not
named clearly enough for a deterministic id join.

## Checks

- `node --test tests/lead_run_crosswalk.test.js`: PASS, 16/16.
- L1 scratch crosswalk reruns: LOTM crosswalk behavior identical after excluding provenance hashes; non-reaction fitness comparison did not complete because the comparison included report metadata. Crosswalk scratch folders were removed. Re-run the normalized report comparison before treating this gate as passed.
- Source-text paragraph review: not performed for unclear triggers. Rows preserve their cited locators for the next review; this checkpoint does not claim CLR1's paragraph review complete.
