# Tooling and reproducibility

Lane `discworld-2`, 2026-10-14. Work root `~/.codex/research/discworld-2/`. No installs. No binaries, build scripts, driver or game executed. Source clone is read-only after acquisition. No login, terms acceptance, save access, staging, commit or push.

## Source

- Repository: https://github.com/Yuffster/discworld_distribution_mudlib
- Command: `git clone --depth 1 https://github.com/Yuffster/discworld_distribution_mudlib.git ~/.codex/research/discworld-2/repos/distribution`
- Pin: `8c8619c64c0a41f09e406a97ee1e0a084ff92a60`, mirror commit 2012-05-27, message “initial mirror”. README says distribution v20.0; central files carry 2003 revisions. Cut-down release does not match complete modern server.
- README terms: public use without warranty; code must be used free of charge; commercial code use prohibited. No permissive SPDX licence identified. This pass retains paraphrased mechanisms only and proposes no code reuse. Bundled component notices, such as the Java telnet client's, do not relicense the whole mudlib.
- Discovery also found quixadhal/discworld, an unofficial bundle/history fork, but did not clone, inspect its modifications or substitute its version for the pinned distribution.

## Fetching and reading

`curl -L --fail --max-time 40` worked for Wikipedia. Python standard-library `urllib.request.urlopen(..., timeout=...)` worked for official help, reference articles, archive availability and seven replays. Scripts ran with `python3 -I`; HTML was parsed as text with `html.parser`, excluding script/style content in cleaned captures. No downloaded program was run. Wiki requests were sequential with at least 1.1 seconds between requests. Raw files are named by help topic, singular guild name, `ref-N`, `archive-<title>.json`, `replay-<title>` or `snapshot-archive-<title>`.

Mechanical rerun:

1. Verify the source pin with `git -C ~/.codex/research/discworld-2/repos/distribution rev-parse HEAD`. Read README before any reuse.
2. Open the exact URLs in SOURCE_LEDGER.md. Official help uses `https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/<topic>`; guild pages use `playing/guild_ob.c?guild=<singular>`.
3. For archive discovery use `https://archive.org/wayback/available?url=dwwiki.mooo.com/wiki/<Title>`, then the returned snapshot. Empty results are inconclusive. Exact successful timestamps are in SOURCE_LEDGER.
4. Use `rg` for the symbols in SKILL_GROWTH.md, then read their complete branches and callers with `sed`/`cat`. Do not run the mud to validate this research.
5. Hash raw extracts with SHA-256, validate FINDINGS.json and the required artifacts. Resume only named unread items when the failed route changes.

## Dead ends and corrections

- `bs4` import failed. Switched to built-in HTMLParser; installed nothing.
- Initial git clone took over a minute with no progress output, then completed successfully. It was not restarted.
- Web archive/CDX route inaccessible; shell archive availability and replay provided a different working route. Shell wildcard CDX query timed out. No repeated CDX variants.
- Five archived pages failed once each on replay: Taskmaster 500, Player housing 500, Assassins' Guild 500, Warriors' Guild 500, Fools' Guild 404. No retries/date hopping/bypass.
- Empty availability responses were not reliable: explicit nearest replay later recovered Death, Skills, Teaching, Priests and Witches. Record replay outcome separately.
- Guessed `playing/guilds/<plural>.html` returned 404 for each guild. Switched to observed official navigation URLs, which worked. The static paths should not be reused.
- Web tool failed Armchair Arcade/PC Gamer; shell archive/original article routes worked. Original Armchair page returned 403; original Mud Connector page returned 404. Their archived articles worked.
- LPMud FAQ HTTP original returned 400. Did not retry variants; official/source routes answer mechanisms, while full FAQ remains unread.
- Archive book-item HTML fetched but is a catalogue/viewer shell. No scanned-page text was verified. No login attempted.
- A zsh wildcard for nonexistent `doc/GENERAL*` failed; direct README and specific paths supplied terms. A guessed `obj/monster/death.c` path was absent; `include/player.h` reveals the actual omitted domain path.

No main-checkout source/status scan is claimed beyond inspecting the assigned output path and named read-only documents. Other agents' changes are outside this lane's ownership. Final scope verification inspects this output directory only.
