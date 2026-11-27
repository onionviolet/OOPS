# Lane Q3: ideas from the #proto-23 Discord channel (Codex sol)

Read first: [OWNERSHIP.md](OWNERSHIP.md). You own only `docs/research/PROTO23_DISCORD_IDEAS_2026-11-24.md`. Read-only everywhere else; do not edit docs/IDEA_INDEX.md.

Weibao approved searching #proto-23 for ideas. The coordinator already pulled messages through the Discord bridge (you cannot reach Discord from the sandbox) into the gitignored folder `docs/research/proto23/private/`: files `proto23_topic_1.json`, `proto23_topic_2.json` and `proto23_search_*.json` (each JSON has `content[0].text`, a plain-text message list with author, time and message id). Coverage: every message matching "should add", "would be nice", "would be cool"; the first ~170 of 419 "suggestion" hits and ~175 of 1,555 "idea" hits; two topic sweeps. #proto-23 is the Proto23 game's channel in a server Weibao is in. Read docs/research/proto23/DISCORD_RESEARCH_2026-10-15.md and docs/research/DISCORD_ATLAS_DESIGN_IDEAS_2026-11-24.md (DY1-DY40, the house format) first, so you do not repeat what they already record.

Do:
1. Read all the pulled messages. Extract distinct game ideas, feature requests, design complaints and player-observed problems that could matter to OOPS (an idle RPG that absorbed Proto23 ideas). Dedupe across files by message id.
2. Write the doc with codes `P23D1`, `P23D2`, ... in the DY doc's format: each idea paraphrased in your own words (paraphrase rather than quote other people's messages, for the reason that they did not consent to publication; no usernames; cite message ids and dates), how many messages raised it, whether OOPS already has it (search the repo and `node prototypes/world-atlas/ideas.mjs search <term>`; cite the file or idea code), and a fit note. Rank the top 10 for OOPS.
3. A coverage section: exactly what was and was not searched (the counts above), and that this is a sample of a channel active since 2021.
4. Run `npm run -s check:docs` and fix hits in your file. Confirm `node prototypes/world-atlas/ideas.mjs search P23D --all` lists your codes.

Report: the doc path, the count of ideas, the top 10 in one line each, and a one-line IDEA_INDEX entry for the coordinator.
