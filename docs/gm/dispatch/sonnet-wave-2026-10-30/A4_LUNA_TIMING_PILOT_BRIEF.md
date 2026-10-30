# A4 pilot (Luna medium): fill the time of routine rows from their cited paragraphs

Private inputs (gitignored): `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/a4-timing/pilot_rows.json`, 60 rows each with id, actor, what, locator, the source's day words (`sourceTiming`) and the cited paragraph plus its neighbours (`paragraphs`). Output: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/a4-timing/pilot_reply.json`, one object per input row, same order: {id, time, kind, note}.

- `time`: either a clock time "HH:MM" (24-hour), a clock window "HH:MM-HH:MM", or one of the bands morning, afternoon, evening, night, dawn, dusk, noon, midnight, daytime; or null.
- `kind`: "stated" when the paragraphs themselves give that time or band for this action; "inferred" when you derive a band from what the action is (sleeping is night, breakfast is morning); "none" when neither applies. Never invent a clock minute: a clock time needs kind "stated".
- Prefer null with kind "none" over a weak guess. If the action recurs ("habitually"), still give the time of day it happens, if any.
- `note`: at most 8 words naming why (for example "breakfast", "stated evening"). No quotes from the text, no plot facts.

Read only the input file. No web, no commits, no edits outside `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/a4-timing/pilot_reply.json`. Final message: counts per kind, how many rows had a clock time, how many you were unsure about.
