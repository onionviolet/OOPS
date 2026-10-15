# Rogue Legacy 1 released FNA source: tooling and provenance

Date: 2026-10-14. Work root: `/Users/weiwei/.codex/research/bf-public-other/`. Installs: **none**, including no game, mod loader, library or new CLI. Existing git, Python 3 and shell only. No downloaded script/build was executed. The two fetch scripts, indexer and output generator are original research helpers under `tools/`. All downloaded content was treated as data.

Read first: COMMON then ASPECTS, PROJECT top 80 lines, standing UI/deep-detail/possible-options USER_VISION sections. Prior REPORT and CHECKPOINT read for each game. No separate prior COVERAGE.md/TOOLING.md exists. Prior Rogue Legacy COVERAGE.json records bounded historical coverage; it is not proof of fresh semantic reads.

Public clone: `https://github.com/flibitijibibo/RogueLegacy1.git`, private path `repos/RogueLegacy1`, HEAD `b41c17888a91100bbf8f1febecaa636a1b421f5b`. Worked: `git clone --depth 1 <URL> <empty destination>`; `git -C <destination> rev-parse HEAD`; `rg --files`; targeted `sed`/`rg`; `python3 -I tools/inventory.py`. Fresh pin equals the prior pin. See [hashes](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt). No submodule dependencies, ROMs or retail assets acquired.

License boundary: custom noncommercial source license, Cellar Door Games attribution, absent art/music proprietary. README points to incompatible original editor; do not run it. Eight .resx files were parsed with stdlib ElementTree and retained as private JSON. Dialogue registration extraction was restricted to Initialize; 106 records, 329 speaker/page pairs, no length mismatch. Full locale key counts: base 1619, zh 1444, fr 2748, es 2745, pt 2743, ru 2743, pl 2742, de 2743. Parsing is not semantic validation of every translation.

Dead-end local lookups: some expected source paths differed from guesses (MM qrand is under src/boot/libc64; RL LocaleBuilder is under RogueCastle, diary room under Game Objects/RoomObjs; NH class is ConditionalsManager). Switched to rg file discovery. Large initial combined prior-file output was truncated, then bounded game reads supplied the missing content. No missing file was silently treated as an absent system.

Private data contains full public captures and clones, not personal saves. Committed outputs contain paraphrase and short identifiers only. No git add/commit/push, source edit, runtime build, launch or owner update. Later native acceptance belongs to a selected implementation wave.
