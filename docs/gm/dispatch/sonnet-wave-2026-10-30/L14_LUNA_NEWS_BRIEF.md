# L14 Luna brief: classify volume 1 news rows into world-event fields

You write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/l14-2026-10-30/news_class.jsonl` (gitignored). No commits, no web, no edits elsewhere. Do not run other commands that write files.

Input: `docs/research/novels/lord-of-mysteries/private/l14-2026-10-30/news_in.jsonl` (240 rows: `id`, `chapter`, `date`, `what`, `scope`, `carriedBy`, `label`, `locator`) and `scene_days.jsonl` (same folder; scenes with `frame`, `frameDay`, `chapters`, `note`). Read both whole. Design: `docs/gm/dispatch/sonnet-wave-2026-10-30/L14_CALENDAR_DESIGN.md` (event record).

Output: one JSON line per input id, all 240, fields:
- `id` (copied)
- `kind`: `public_event` | `institution_notice` | `disaster` | `curfew` | `festival` | `private_fact` (a fact one person holds or plans; not a happening) | `canon_beat` (an act in the lead's own scene)
- `placement`: `anchored` (the row's date text gives a day relative to a scene: "next morning", "two days after", "last Thursday" with a known scene) | `ordinal` (no usable day; runs when the lead reaches the chapter) | `unplaced` (past or unknowable, e.g. "before Solis's death", "not stated" with no scene)
- `frame`: the `frame` id of the scene whose chapter range is nearest at or before `chapter` (null if none)
- `offsetDays`: integer days from that frame's root when placement is `anchored`, else null; negative for "before"
- `durationDays`: integer or null
- `route`: one of `newspaper`, `telegram`, `letter`, `diary`, `notice_board`, `police_file`, `word` (a named person told someone), `overheard`, `witness`, `none`; from `carriedBy`
- `delayDays`: integer days from the event's end to the route delivering it (newspaper 1, telegram 0, letter 2-5, word 0-1; stated delays win), or null
- `audience`: `public` or `named` (then `via`: the carrier's id or name)
- `evidence`: the row's `label` (S, T, I or U), downgraded to I when you inferred the offset
- `note`: at most 12 words in your own words on why; never copy source text

Rules: do not invent days; if unsure use `ordinal` or `unplaced`. `private_fact` rows get `route` `none` unless the row says it was spread. English only, no quotes of the source.
Done check: 240 lines, each valid JSON, ids unique and equal to the input ids.
