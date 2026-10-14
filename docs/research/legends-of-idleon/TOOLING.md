# Tooling and rerun

Work area: `/Users/weiwei/.codex/research/idleon/`. Only repo output is `docs/research/legends-of-idleon/`. Raw source/table text remains in the work area. No clone, repository commit, game install, login or play. No package/tool installs. Existing curl and Python 3 standard library used; downloaded JavaScript never executed.

## Successful route

1. Official homepage was read with web tools. Its web-play link resolved to `https://www.legendsofidleon.com/ytGl5oc/`.
2. `curl -L --fail --max-time 40 https://www.legendsofidleon.com/ytGl5oc/ -o <extract>/web-index.html` downloaded the static shell. Its script includes `./N.js`.
3. `curl -sSL --fail --max-time 90 https://www.legendsofidleon.com/ytGl5oc/N.js -o <extract>/N.js` transferred 7,303,927 of 26,184,213 bytes before timing out. The already accessible transfer was resumed with `curl -sSL --fail --continue-at - --max-time 900 <same asset URL> -o <extract>/N.js`. This resumed bytes, not a repeated login/403/TLS route. Final completion and length were checked before hashing.
4. Wiki page access through web tools failed as restricted/robots. The first curl MediaWiki API request for Worlds succeeded: `https://idleon.wiki/api.php?action=parse&page=Worlds&prop=text&format=json`.
5. Python urllib API requests for other pages returned 403. Switched to MediaWiki export rather than retrying API variants: `https://idleon.wiki/wiki/Special:Export/Alchemy`. Export succeeded. It preserves article wikitext and revision ID.
6. Existing work-area helper: `python3 -I <work>/tools/wiki_export.py <extract> Skills Character_Creation Game_Mechanics Alchemy Construction Laboratory Cooking Breeding Divinity Sailing Gaming Farming Sneaking Summoning Spelunking Research Shimmerfin_Deep Coral_Reef Game_Mechanics_AFK`. Helper fetches sequentially and waits 1.1 seconds between requests. It skips existing extracts.
7. Fetch generated table rows separately, because article exports contain Lua invocations rather than expanded data: append `Module:Mechanics/data.json Module:Laboratory/data.json Module:Divinity/data.json Module:Construction/data.json Module:Research/data.json Module:Spelunking/data.json Module:Alchemy/data.json Module:CoralReef/data.json` to the same helper command. These datasets describe generator version 1.22; they are not guaranteed to match every currently served code byte.
8. Static inspection used Python string slicing and `rg`, especially `_customBlock_AFKgains`, `_customBlock_HourlyKillRate`, `_customBlock_AFKgainrates`, `_customBlock_Divinity`, `NewCharLvReq`, `GodsInfo`, `PlayerDATABASE`, `_event_cardQuickRef`. No deobfuscator needed for readable semantic names; no formatter/tool install.

## Dead ends and fixes

`Characters`, `AFK_Gains`, `Quick_Reference`, `Villagers` and `Module:Coral_Reef` exports contain no page text. These are absent/mismatched titles, not evidence that the mechanics do not exist. Correct source titles or shipped event handlers were used. `Game_Mechanics_AFK` exists but is explicitly outdated.

The first helper pass for data pages failed locally because `/` in the page name became a nonexistent output subdirectory. The helper now replaces `/` with `_` for filenames, keeping the source URL intact. Re-fetched those pages after fixing the local write error.

Initial broad git/source output was truncated. Later checks were scoped. Two guessed YAIRPG paths (`src/game.js`, `src/saving.js`) do not exist; no claim relies on them. Read actual `src/activities.js`, `src/workspace_layout.js` and `src/event_feed.js` for comparison.

## Reproducibility

[Source ledger](SOURCE_LEDGER.md) lists revisions, hashes and static symbols. `extract/HASHES.txt` hashes every acquired extract except the manifest itself. Local raw notes hold selected code contexts. For a refresh, use a new empty extraction directory, not overwriting this snapshot. A later bundle/wiki revision may change rates, slots and mappings.
