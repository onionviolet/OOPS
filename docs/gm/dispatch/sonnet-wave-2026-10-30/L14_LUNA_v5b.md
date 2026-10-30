# L14 Luna brief: classify later-volume news rows (v5b is given in your launch line)

You write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/l14-2026-10-30/news_class_v5b.jsonl` (gitignored). No commits, no web, no edits elsewhere.

Input: `.../private/l14-2026-10-30/news_in_v5b.jsonl` (rows: `id`, `chapter`, `date`, `what`, `scope`, `carriedBy`, `label`, `locator`). Read it whole. Design: `docs/gm/dispatch/sonnet-wave-2026-10-30/L14_CALENDAR_DESIGN.md`. Same field rules as `L14_LUNA_NEWS_BRIEF.md`, with these changes: there are no scene frames in these volumes, so omit `frame`, set `offsetDays` null, and `placement` is only `ordinal` (a happening or notice that runs when the lead reaches its chapter) or `unplaced` (past, vague or unknowable). Rows that are one person's fact or plan are `private_fact` with route `none`. Keep `kind`, `durationDays`, `route`, `delayDays`, `audience`/`via`, `evidence`, `note` (at most 12 words, own words, no source quotes) as specified there.
Done check: one valid JSON line per input id, ids unique and equal to the input ids.
