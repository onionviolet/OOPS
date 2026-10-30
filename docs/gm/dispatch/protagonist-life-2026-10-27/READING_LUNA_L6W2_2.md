# Lane brief: sw-l6w2-2 Circle of Inevitability (people, rules, texture)

Model: gpt-6-luna, medium. Working directory /Users/weiwei/code/yet-another-idle-rpg. Do not edit the repo, commit, stash, reset, push, or use the web.

For each id in [ coic029 033 037L ], and for each pass P in people, rules, texture, one at a time:
1. Read in full docs/research/novels/circle-of-inevitability/private/lead-run-2026-10-28/luna-l6/w2/$P/prompts/<id>-$P.md (reader instructions, output schema, known names, shard text, separated by "=====").
2. Follow it exactly as the bounded source reader: record only what the shard states, no outside knowledge of the book or its sequels, exact locators; omit people with nothing recorded rather than writing empty stubs.
3. Write the bare JSON the prompt asks for (no fences, no commentary) to docs/research/novels/circle-of-inevitability/private/lead-run-2026-10-28/luna-l6/w2/$P/replies/<id>-$P.json and verify it parses (node -e).
Do all nine files, then report one line: ids done and anything unsure.
