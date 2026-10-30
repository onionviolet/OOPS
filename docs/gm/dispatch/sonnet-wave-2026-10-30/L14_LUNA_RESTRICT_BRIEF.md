# L14 Luna brief: restriction effects from placed city-scale news rows (GM38)

You write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/l14-2026-10-30/restrict_class.jsonl` (gitignored). No commits, no web, no edits elsewhere.

Input: `.../private/l14-2026-10-30/restrict_in.jsonl` (155 rows: `id`, `chapter`, `kind`, `what`, `date`, `scope`, `locator`). Read it whole. Design: `docs/gm/dispatch/sonnet-wave-2026-10-30/L14_CALENDAR_DESIGN.md`, section "Restrictions". Optionally read the cited paragraph via `node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --topic <regex>` only when a row is unclear; do not copy source text.

One JSON line per input id (all 155), fields:
- `id` (copied)
- `effects`: a list, possibly empty, of `{kind: 'curfew'|'closure'|'travel_halt', scope: 'region'|'district'|'place'|'institution'|'route', scope_text: short English noun phrase in your own words or null, means: 'road'|'rail'|'sea'|'air'|'crossing'|null, hours: [startHour, endHour] integers 0-24 only if the row or paragraph states times, else null, durationDays: integer only if stated, else null}`
- `kind_fix`: the better event kind if the row's `kind` is wrong (`public_event`, `institution_notice`, `disaster`, `curfew`, `festival`, `canon_beat`) else null
- `note`: at most 12 words, own words, why

Rules: a restriction is something that closes, forbids or halts movement or service for the public on a day or window (a curfew, a closed bank, a halted train, a blocked road, a sealed district, a search checkpoint). A disaster or battle that is only news is `effects: []`. Do not invent hours or durations. A guard patrolling is not a curfew unless the row says people are barred.
Done check: 155 lines, valid JSON, ids unique and equal to the input ids.
