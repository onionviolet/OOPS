# A2 (Luna medium): do later-volume routine and hours rows fit the shape? (WB1)

Read-only extraction. Private input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged` (people rows with `routine`, place rows with hours). Output: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/a2-sample/sample.json` (gitignored) and a final message with counts only. No commits, no web, no edits outside that folder, no book prose in the final message.

Pick about 20 rows with shard prefix `lotm<N>c` for N in 2..8 (at least two per volume where available): routine slots and place opening hours. For each, record: id, shard, locator, and whether the row fits the current shape: routine = actor, place, what, `sourceTiming` (days / time words), optional `roleHours`; hours = `worldHours` row. For each misfit name the missing field in a few words (examples to look for: seasonal or multi-day cycles, travel between cities, non-Tingen calendars, hours that differ by role, "irregular").

Final message: N rows sampled, N fit, a list of misfit kinds with counts and one id each.
